import { useCallback, useEffect, useRef, useState } from "react";
import type { KeyboardEvent } from "react";
import { FiCpu, FiMic, FiMicOff, FiSend, FiSkipForward, FiVolume2, FiVolumeX } from "react-icons/fi";
import type { DemoQuestion, DemoTurn } from "../../data/demoInterview";
import { pickFollowUp } from "../../utils/demoScoring";
import type { AnsweredTurn } from "../../utils/demoScoring";
import { speak, stopSpeaking, useSpeechInput } from "../../hooks/useSpeech";

interface Message {
  id: number;
  from: "ai" | "me";
  text: string;
  skipped?: boolean;
}

interface Current {
  qIndex: number;
  isFollowUp: boolean;
  turn: DemoTurn;
}

interface DemoRoomProps {
  role: { title: string; questions: DemoQuestion[] };
  // Pehle sawaal se pehle interviewer ki intro line
  intro?: string;
  // Har jawab ke liye time limit (sirf dikhata hai, auto-submit nahi karta)
  answerTimeLimitSec?: number;
  voiceOn: boolean;
  onVoiceChange: (on: boolean) => void;
  // elapsedSec: interview me kitna time laga
  onFinish: (answers: AnsweredTurn[], elapsedSec: number) => void;
}

const THINK_DELAY = 1200;
const CLOSING_LINE = "That's all from my side. Thanks for your time! Let's look at how you did.";

let messageId = 0;

const formatTime = (sec: number) =>
  `${String(Math.floor(sec / 60)).padStart(2, "0")}:${String(sec % 60).padStart(2, "0")}`;

const DemoRoom = ({ role, intro, answerTimeLimitSec, voiceOn, onVoiceChange, onFinish }: DemoRoomProps) => {
  const firstQuestion = role.questions[0];

  const [messages, setMessages] = useState<Message[]>(() => [
    ...(intro ? [{ id: ++messageId, from: "ai" as const, text: intro }] : []),
    { id: ++messageId, from: "ai", text: firstQuestion.question },
  ]);
  const [current, setCurrent] = useState<Current | null>({
    qIndex: 0,
    isFollowUp: false,
    turn: firstQuestion,
  });
  const [answers, setAnswers] = useState<AnsweredTurn[]>([]);
  const [draft, setDraft] = useState("");
  const [thinking, setThinking] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  // Current sawaal kis second pe poocha gaya (answer timer ke liye)
  const [askedAt, setAskedAt] = useState(0);

  const timers = useRef<number[]>([]);
  const chatRef = useRef<HTMLDivElement>(null);
  const startedAt = useRef(0);

  const appendSpeech = useCallback(
    (text: string) => setDraft((d) => (d.trim() ? `${d.trim()} ${text}` : text)),
    [],
  );
  const mic = useSpeechInput(appendSpeech);

  // Interview ka timer
  useEffect(() => {
    startedAt.current = Date.now();
    const id = window.setInterval(() => {
      setElapsed(Math.floor((Date.now() - startedAt.current) / 1000));
    }, 1000);
    return () => window.clearInterval(id);
  }, []);

  // Pehla sawaal bol ke sunana
  useEffect(() => {
    if (voiceOn) speak(intro ? `${intro} ${firstQuestion.question}` : firstQuestion.question);
    return () => stopSpeaking();
    // sirf mount pe
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Page chhodne pe pending timeouts band
  useEffect(() => {
    const pending = timers.current;
    return () => pending.forEach((t) => window.clearTimeout(t));
  }, []);

  // Naya message aaye to chat neeche scroll
  useEffect(() => {
    const el = chatRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [messages.length, thinking]);

  const secondsSinceStart = () => Math.floor((Date.now() - startedAt.current) / 1000);

  const later = (fn: () => void, ms: number) => {
    timers.current.push(window.setTimeout(fn, ms));
  };

  const askNext = (text: string, next: Current | null) => {
    setThinking(false);
    setMessages((m) => [...m, { id: ++messageId, from: "ai", text }]);
    setCurrent(next);
    setAskedAt(secondsSinceStart());
    if (voiceOn) speak(text);
  };

  const submit = (skipped: boolean) => {
    if (!current || thinking) return;
    const answer = skipped ? "" : draft.trim();
    if (!skipped && !answer) return;

    if (mic.listening) mic.stop();
    stopSpeaking();

    const record: AnsweredTurn = {
      topic: role.questions[current.qIndex].topic,
      isFollowUp: current.isFollowUp,
      turn: current.turn,
      answer,
      skipped,
    };
    const nextAnswers = [...answers, record];
    setAnswers(nextAnswers);
    setMessages((m) => [
      ...m,
      { id: ++messageId, from: "me", text: skipped ? "Skipped this question" : answer, skipped },
    ]);
    setDraft("");
    setThinking(true);

    // Main sawaal ka jawab diya ho to follow-up, warna agla main sawaal
    const question = role.questions[current.qIndex];
    const followUp = !current.isFollowUp && !skipped ? pickFollowUp(question, answer) : undefined;

    if (followUp) {
      later(
        () => askNext(followUp.question, { qIndex: current.qIndex, isFollowUp: true, turn: followUp }),
        THINK_DELAY,
      );
      return;
    }

    const nextIndex = current.qIndex + 1;
    if (nextIndex < role.questions.length) {
      const nextQ = role.questions[nextIndex];
      later(
        () => askNext(nextQ.question, { qIndex: nextIndex, isFollowUp: false, turn: nextQ }),
        THINK_DELAY,
      );
    } else {
      later(() => askNext(CLOSING_LINE, null), THINK_DELAY);
      later(() => onFinish(nextAnswers, secondsSinceStart()), THINK_DELAY + 2600);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      submit(false);
    }
  };

  const endEarly = () => {
    timers.current.forEach((t) => window.clearTimeout(t));
    stopSpeaking();
    if (mic.listening) mic.stop();
    onFinish(answers, secondsSinceStart());
  };

  const remaining = answerTimeLimitSec ? Math.max(0, answerTimeLimitSec - (elapsed - askedAt)) : null;
  const showAnswerTimer = remaining !== null && !!current && !thinking;

  const questionNumber = (current?.qIndex ?? role.questions.length - 1) + 1;
  const progress = ((current ? current.qIndex : role.questions.length) / role.questions.length) * 100;

  return (
    <div className="interview container">
      <div className="interview__panel">
        <div className="interview__bar">
          <span className="room__live">
            <span className="room__dot" /> Live
          </span>
          <span className="interview__meta">
            {role.title} · Question {questionNumber} of {role.questions.length}
            {current?.isFollowUp && <span className="tag">Follow-up</span>}
          </span>
          {showAnswerTimer && (
            <span
              className={`answer-timer ${remaining <= 15 ? "is-low" : ""}`}
              title="Time left for this answer"
            >
              {remaining > 0 ? formatTime(remaining) : "Time’s up"}
            </span>
          )}
          <span className="room__timer" title="Total interview time">
            {formatTime(elapsed)}
          </span>
          <button
            type="button"
            className="icon-btn"
            onClick={() => {
              if (voiceOn) stopSpeaking();
              onVoiceChange(!voiceOn);
            }}
            aria-label={voiceOn ? "Mute interviewer" : "Unmute interviewer"}
            title={voiceOn ? "Mute interviewer" : "Unmute interviewer"}
          >
            {voiceOn ? <FiVolume2 /> : <FiVolumeX />}
          </button>
          <button type="button" className="btn btn--ghost btn--sm" onClick={endEarly}>
            End
          </button>
        </div>
        <div className="interview__progress">
          <span style={{ width: `${progress}%` }} />
        </div>

        <div className="interview__chat" ref={chatRef} aria-live="polite">
          {messages.map((m) => (
            <div key={m.id} className={`msg msg--${m.from} ${m.skipped ? "msg--skipped" : ""} msg--enter`}>
              <span className="msg__who">
                {m.from === "ai" ? (
                  <>
                    <FiCpu /> Interviewer
                  </>
                ) : (
                  "You"
                )}
              </span>
              <p>{m.text}</p>
            </div>
          ))}
          {thinking && (
            <div className="msg msg--ai msg--enter">
              <span className="msg__who">
                <FiCpu /> Interviewer
              </span>
              <span className="typing" aria-label="Interviewer is thinking">
                <span />
                <span />
                <span />
              </span>
            </div>
          )}
        </div>

        <div className="composer">
          <textarea
            className="composer__input"
            placeholder={
              current
                ? mic.listening
                  ? "Listening… speak your answer"
                  : "Type your answer like you would say it in the interview…"
                : "Interview finished"
            }
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={!current || thinking}
            rows={3}
            autoFocus
          />
          <div className="composer__actions">
            <div className="composer__left">
              {mic.supported && (
                <button
                  type="button"
                  className={`icon-btn icon-btn--mic ${mic.listening ? "is-live" : ""}`}
                  onClick={mic.listening ? mic.stop : mic.start}
                  disabled={!current || thinking}
                  aria-label={mic.listening ? "Stop recording" : "Answer with voice"}
                  title={mic.listening ? "Stop recording" : "Answer with voice"}
                >
                  {mic.listening ? <FiMicOff /> : <FiMic />}
                </button>
              )}
              <span className="composer__hint">Ctrl + Enter to send</span>
            </div>
            <div className="composer__right">
              <button
                type="button"
                className="btn btn--ghost btn--sm"
                onClick={() => submit(true)}
                disabled={!current || thinking}
              >
                <FiSkipForward /> Skip
              </button>
              <button
                type="button"
                className="btn btn--primary btn--sm"
                onClick={() => submit(false)}
                disabled={!current || thinking || !draft.trim()}
              >
                Send answer <FiSend />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DemoRoom;

import { useCallback, useEffect, useRef, useState } from "react";
import type { KeyboardEvent } from "react";
import {
  FiAlertCircle,
  FiCpu,
  FiMic,
  FiMicOff,
  FiSend,
  FiSkipForward,
  FiTrash2,
  FiVolume2,
  FiVolumeX,
} from "react-icons/fi";
import type { DemoQuestion, DemoTurn } from "../../data/demoInterview";
import { pickFollowUp } from "../../utils/demoScoring";
import type { AnsweredTurn } from "../../utils/demoScoring";
import { speak, stopSpeaking, useSpeechInput } from "../../hooks/useSpeech";
import { useRecorder } from "../../hooks/useRecorder";
import type { Recording } from "../../hooks/useRecorder";
import VoiceNote from "../../components/VoiceNote";

interface Message {
  id: number;
  from: "ai" | "me";
  text: string;
  skipped?: boolean;
  // Voice answer: recording + uska text (text sirf "Show transcript" pe)
  audio?: { url: string; durationSec: number };
  status?: "processing" | "error";
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
  // Har sawaal ki apni time limit (sirf dikhata hai, auto-submit nahi karta). Na ho to timer nahi.
  timeLimitFor?: (turn: DemoTurn, isFollowUp: boolean) => number | undefined;
  voiceOn: boolean;
  onVoiceChange: (on: boolean) => void;
  // elapsedSec: interview me kitna time laga
  onFinish: (answers: AnsweredTurn[], elapsedSec: number) => void;
  // Diya ho to mic asli audio record karta hai (voice note), aur ye usse text banata hai (AI scoring ke liye).
  // Na diya ho (bina login demo) to mic bolne ko seedha text box me likhta hai.
  transcribe?: (audio: Blob, filename: string) => Promise<string>;
}

const THINK_DELAY = 1200;
const CLOSING_LINE = "That's all from my side. Thanks for your time! Let's look at how you did.";
const WAVE_BARS = 24;

let messageId = 0;

const formatTime = (sec: number) =>
  `${String(Math.floor(sec / 60)).padStart(2, "0")}:${String(sec % 60).padStart(2, "0")}`;

const DemoRoom = ({
  role,
  intro,
  timeLimitFor,
  voiceOn,
  onVoiceChange,
  onFinish,
  transcribe,
}: DemoRoomProps) => {
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
  // Voice answer ka text ban raha hai (tab tak naya jawab nahi)
  const [processing, setProcessing] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  // Current sawaal kis second pe poocha gaya (answer timer ke liye)
  const [askedAt, setAskedAt] = useState(0);
  // Kis voice answer ka transcript khula hai
  const [openTranscript, setOpenTranscript] = useState<number | null>(null);

  const timers = useRef<number[]>([]);
  const chatRef = useRef<HTMLDivElement>(null);
  const startedAt = useRef(0);
  const audioUrls = useRef<string[]>([]);
  // Page chhod diya ho to transcription ka jawab aane pe kuch na karo
  const alive = useRef(true);

  // Demo: bolna -> text box
  const appendSpeech = useCallback(
    (text: string) => setDraft((d) => (d.trim() ? `${d.trim()} ${text}` : text)),
    [],
  );
  const speech = useSpeechInput(appendSpeech);
  // Asli interview: bolna -> recording. 5 min pura hone pe khud send (neeche sendRecording)
  const sendRef = useRef<() => void>(() => {});
  const recorder = useRecorder(() => sendRef.current());
  const recordMode = !!transcribe && recorder.supported;

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

  // Page chhodne pe pending timeouts band, recordings ki memory free
  useEffect(() => {
    alive.current = true;
    const pending = timers.current;
    const urls = audioUrls.current;
    return () => {
      alive.current = false;
      pending.forEach((t) => window.clearTimeout(t));
      urls.forEach((u) => URL.revokeObjectURL(u));
    };
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

  // Aakhri line: interviewer poori bol le, tabhi report/scoring (pehle beech me kat jaati thi)
  const closeInterview = (finalAnswers: AnsweredTurn[]) => {
    setThinking(false);
    setMessages((m) => [...m, { id: ++messageId, from: "ai", text: CLOSING_LINE }]);
    setCurrent(null);

    let done = false;
    const finish = () => {
      if (done || !alive.current) return;
      done = true;
      onFinish(finalAnswers, secondsSinceStart());
    };

    if (voiceOn) {
      speak(CLOSING_LINE, () => later(finish, 600));
      // Chrome kabhi "end" event nahi bhejta; tab bhi atke nahi
      later(finish, CLOSING_LINE.length * 90 + 4000);
    } else {
      // Awaaz band: padhne ka time
      later(finish, 2600);
    }
  };

  // Jawab save karo aur agla sawaal / follow-up (typed aur voice dono yahi se)
  const advance = (turnNow: Current, answer: string, skipped: boolean) => {
    const record: AnsweredTurn = {
      topic: role.questions[turnNow.qIndex].topic,
      isFollowUp: turnNow.isFollowUp,
      turn: turnNow.turn,
      answer,
      skipped,
    };
    const nextAnswers = [...answers, record];
    setAnswers(nextAnswers);
    setThinking(true);

    // Main sawaal ka jawab diya ho to follow-up, warna agla main sawaal
    const question = role.questions[turnNow.qIndex];
    const followUp = !turnNow.isFollowUp && !skipped ? pickFollowUp(question, answer) : undefined;

    if (followUp) {
      later(
        () => askNext(followUp.question, { qIndex: turnNow.qIndex, isFollowUp: true, turn: followUp }),
        THINK_DELAY,
      );
      return;
    }

    const nextIndex = turnNow.qIndex + 1;
    if (nextIndex < role.questions.length) {
      const nextQ = role.questions[nextIndex];
      later(
        () => askNext(nextQ.question, { qIndex: nextIndex, isFollowUp: false, turn: nextQ }),
        THINK_DELAY,
      );
    } else {
      later(() => closeInterview(nextAnswers), THINK_DELAY);
    }
  };

  const busy = !current || thinking || processing;

  // Type kiya jawab ya Skip
  const submit = (skipped: boolean) => {
    if (!current || busy || recorder.recording) return;
    const answer = skipped ? "" : draft.trim();
    if (!skipped && !answer) return;

    if (speech.listening) speech.stop();
    stopSpeaking();

    setMessages((m) => [
      ...m,
      { id: ++messageId, from: "me", text: skipped ? "Skipped this question" : answer, skipped },
    ]);
    setDraft("");
    advance(current, answer, skipped);
  };

  const startRecording = () => {
    if (busy) return;
    stopSpeaking();
    recorder.start();
  };

  // Recording -> voice note bubble -> backend se text -> agla sawaal
  const sendRecording = async () => {
    if (!current || !transcribe) return;
    const turnNow = current;
    const rec: Recording | null = await recorder.stop();
    if (!rec) return;

    const url = URL.createObjectURL(rec.blob);
    audioUrls.current.push(url);
    const id = ++messageId;
    setMessages((m) => [
      ...m,
      { id, from: "me", text: "", audio: { url, durationSec: rec.durationSec }, status: "processing" },
    ]);
    setProcessing(true);

    try {
      const text = await transcribe(rec.blob, rec.filename);
      if (!alive.current) return;
      setMessages((m) => m.map((msg) => (msg.id === id ? { ...msg, text, status: undefined } : msg)));
      setProcessing(false);
      advance(turnNow, text, false);
    } catch (err) {
      if (!alive.current) return;
      const reason = err instanceof Error ? err.message : "Couldn't process your recording.";
      setMessages((m) => m.map((msg) => (msg.id === id ? { ...msg, text: reason, status: "error" } : msg)));
      setProcessing(false);
    }
  };

  // Recorder ka 5 min wala callback hamesha latest sendRecording chalaye
  useEffect(() => {
    sendRef.current = () => void sendRecording();
  });

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      submit(false);
    }
  };

  const endEarly = () => {
    timers.current.forEach((t) => window.clearTimeout(t));
    stopSpeaking();
    if (speech.listening) speech.stop();
    recorder.cancel();
    onFinish(answers, secondsSinceStart());
  };

  const limit = current && timeLimitFor ? timeLimitFor(current.turn, current.isFollowUp) : undefined;
  const remaining = limit ? Math.max(0, limit - (elapsed - askedAt)) : null;
  const showAnswerTimer = remaining !== null && !!current && !thinking;

  // Kul kitne sawaal hain wo nahi batate (follow-up milake asli interview jaisa)
  const questionNumber = (current?.qIndex ?? role.questions.length - 1) + 1;

  const placeholder = !current
    ? "Interview finished"
    : processing
      ? "Processing your answer…"
      : recordMode
        ? "Tap the mic to answer out loud, or type your answer here…"
        : speech.listening
          ? "Listening… speak your answer"
          : "Type your answer like you would say it in the interview…";

  return (
    <div className="interview container">
      <div className="interview__panel">
        <div className="interview__bar">
          <span className="room__live">
            <span className="room__dot" /> Live
          </span>
          <span className="interview__meta">
            {role.title} · Question {questionNumber}
            {current?.isFollowUp && <span className="tag">Follow-up</span>}
          </span>
          {showAnswerTimer && (
            <span
              className={`answer-timer ${remaining <= 60 ? "is-low" : ""}`}
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

        <div className="interview__chat" ref={chatRef} aria-live="polite">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`msg msg--${m.from} ${m.skipped ? "msg--skipped" : ""} ${m.audio ? "msg--voice" : ""} msg--enter`}
            >
              <span className="msg__who">
                {m.from === "ai" ? (
                  <>
                    <FiCpu /> Interviewer
                  </>
                ) : (
                  "You"
                )}
              </span>
              {m.audio ? (
                <>
                  <VoiceNote url={m.audio.url} durationSec={m.audio.durationSec} />
                  {m.status === "processing" && (
                    <span className="msg__status">
                      <span className="spinner spinner--brand" aria-hidden="true" /> Processing your answer…
                    </span>
                  )}
                  {m.status === "error" && (
                    <span className="msg__status msg__status--error" role="alert">
                      <FiAlertCircle /> {m.text} Record again or type your answer.
                    </span>
                  )}
                  {!m.status && m.text && (
                    <button
                      type="button"
                      className="msg__transcript-toggle"
                      onClick={() => setOpenTranscript((open) => (open === m.id ? null : m.id))}
                      aria-expanded={openTranscript === m.id}
                    >
                      {openTranscript === m.id ? "Hide transcript" : "Show transcript"}
                    </button>
                  )}
                  {!m.status && openTranscript === m.id && <p className="msg__transcript">{m.text}</p>}
                </>
              ) : (
                <p>{m.text}</p>
              )}
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
          {recorder.error && (
            <p className="composer__error" role="alert">
              <FiAlertCircle /> {recorder.error}
            </p>
          )}

          {recorder.recording ? (
            // Recording chal rahi hai: text box ki jagah recorder bar
            <div className="recorder" role="status" aria-live="polite">
              <span className="recorder__dot" aria-hidden="true" />
              <span className="recorder__time">{formatTime(recorder.seconds)}</span>
              <span className="recorder__wave" aria-hidden="true">
                {Array.from({ length: WAVE_BARS }, (_, i) => {
                  // Beech ke bars zyada uthte hain, level ke hisaab se
                  const shape = 1 - Math.abs(i - (WAVE_BARS - 1) / 2) / (WAVE_BARS / 2);
                  const height = 12 + recorder.level * 88 * (0.45 + 0.55 * shape) * (0.7 + ((i * 7) % 5) / 10);
                  return <span key={i} style={{ height: `${Math.min(100, height)}%` }} />;
                })}
              </span>
              <span className="recorder__label">Recording your answer…</span>
              <button
                type="button"
                className="icon-btn"
                onClick={recorder.cancel}
                aria-label="Discard recording"
                title="Discard recording"
              >
                <FiTrash2 />
              </button>
              <button type="button" className="btn btn--primary btn--sm" onClick={() => void sendRecording()}>
                Send answer <FiSend />
              </button>
            </div>
          ) : (
            <>
              <textarea
                className="composer__input"
                placeholder={placeholder}
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={busy}
                rows={3}
                autoFocus
              />
              <div className="composer__actions">
                <div className="composer__left">
                  {recordMode ? (
                    <button
                      type="button"
                      className="icon-btn icon-btn--mic"
                      onClick={startRecording}
                      disabled={busy}
                      aria-label="Record your answer"
                      title="Record your answer"
                    >
                      <FiMic />
                    </button>
                  ) : (
                    speech.supported && (
                      <button
                        type="button"
                        className={`icon-btn icon-btn--mic ${speech.listening ? "is-live" : ""}`}
                        onClick={speech.listening ? speech.stop : speech.start}
                        disabled={busy}
                        aria-label={speech.listening ? "Stop dictation" : "Answer with voice"}
                        title={speech.listening ? "Stop dictation" : "Answer with voice"}
                      >
                        {speech.listening ? <FiMicOff /> : <FiMic />}
                      </button>
                    )
                  )}
                  <span className="composer__hint">
                    {recordMode ? "Tap the mic to record · Ctrl + Enter to send text" : "Ctrl + Enter to send"}
                  </span>
                </div>
                <div className="composer__right">
                  <button
                    type="button"
                    className="btn btn--ghost btn--sm"
                    onClick={() => submit(true)}
                    disabled={busy}
                  >
                    <FiSkipForward /> Skip
                  </button>
                  <button
                    type="button"
                    className="btn btn--primary btn--sm"
                    onClick={() => submit(false)}
                    disabled={busy || !draft.trim()}
                  >
                    Send answer <FiSend />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default DemoRoom;

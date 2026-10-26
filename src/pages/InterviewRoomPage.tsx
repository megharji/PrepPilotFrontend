import { useEffect, useMemo, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { FiArrowLeft, FiRotateCcw, FiZap } from "react-icons/fi";
import DemoRoom from "./demo/DemoRoom";
import { answerTimeFor } from "../data/interviewSetup";
import type { DemoQuestion } from "../data/demoInterview";
import { buildInterview } from "../utils/buildInterview";
import { buildReport } from "../utils/demoScoring";
import type { AnsweredTurn, DemoReport } from "../utils/demoScoring";
import { newInterviewId } from "../utils/interviewStats";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import {
  selectAccessToken,
  selectAiInterview,
  selectCreateInterview,
  selectCurrentUser,
  selectInterviewConfig,
} from "../redux/selector";
import { saveInterview } from "../redux/reducers/Interview/interviewReducer";
import {
  prepareQuestionsRequest,
  resetAiInterview,
  submitInterviewRequest,
} from "../redux/reducers/Interview/aiInterviewReducer";
import type { SubmittedAnswer } from "../types/interview.types";
import { transcribeApi } from "../redux/api/Interview/transcribeApi";
import { ApiRequestError } from "../redux/api/apiClient";
import { logout } from "../redux/reducers/Auth/loginReducer";
import { showSnackbar } from "../redux/reducers/Snackbar/snackbarReducer";

interface Finished {
  answers: AnsweredTurn[];
  elapsedSec: number;
}

// Jawab kis sawaal ka hai: DemoRoom wahi sawaal object deta hai jo humne diye the
const toSubmitted = (questions: DemoQuestion[], answers: AnsweredTurn[]): SubmittedAnswer[] =>
  answers.flatMap((a) => {
    const questionIndex = questions.findIndex((q) => q === a.turn || q.followUps.some((f) => f === a.turn));
    return questionIndex < 0
      ? []
      : [{ questionIndex, isFollowUp: a.isFollowUp, answer: a.answer, skipped: a.skipped }];
  });

// Setup ke baad asli interview. Sawaal AI banata hai (role, tech, experience, JD, resume se),
// khatam hone pe AI score deta hai. AI na chale to "Try again" (static sawaal nahi).
const InterviewRoomPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useAppSelector(selectCurrentUser);
  const config = useAppSelector(selectInterviewConfig);
  // Backend (POST /api/interviews) se bana interview
  const serverInterview = useAppSelector(selectCreateInterview).interview;
  const ai = useAppSelector(selectAiInterview);
  const token = useAppSelector(selectAccessToken);
  const [voiceOn, setVoiceOn] = useState(true);
  const [finished, setFinished] = useState<Finished | null>(null);

  const serverId = serverInterview?.id;

  // Room khulte hi AI se sawaal
  useEffect(() => {
    if (serverId !== undefined) dispatch(prepareQuestionsRequest(serverId));
    return () => {
      dispatch(resetAiInterview());
    };
  }, [dispatch, serverId]);

  // Sirf isi interview ke sawaal (purane interview ke nahi)
  const aiQuestions = ai.interviewId === serverId ? ai.questions : null;
  // Request abhi gayi hi nahi tab bhi "preparing"
  const preparing = ai.preparing || (serverId !== undefined && ai.interviewId !== serverId);
  // Memo zaroori: jawab ko sawaal se object reference se milate hain (toSubmitted), naye objects se match tootega
  const userName = user?.name;
  const interview = useMemo(
    () => (config && aiQuestions?.length ? buildInterview(config, aiQuestions, userName) : null),
    [config, userName, aiQuestions],
  );

  const saveAndOpenReport = (report: DemoReport, elapsedSec: number) => {
    if (!user || !serverInterview || !config || !interview) return;
    dispatch(
      saveInterview({
        userId: user.id,
        record: {
          id: newInterviewId(),
          serverId: serverInterview.id,
          roleTitle: interview.title,
          createdAt: new Date().toISOString(),
          durationSec: elapsedSec,
          report,
          config,
        },
      }),
    );
    // Report page backend ki id se khulta hai (GET /api/interviews/:id)
    navigate(`/history/${serverInterview.id}`, { replace: true });
  };

  // AI ne score de diya -> report
  const aiReport = ai.result?.report;
  useEffect(() => {
    if (aiReport && finished) saveAndOpenReport(aiReport, finished.elapsedSec);
    // sirf naya result aane pe
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [aiReport]);

  // Setup kiye bina (ya refresh ke baad) seedha yahan aaye to wapas setup pe
  if (!config || !serverInterview) return <Navigate to="/interview" replace />;

  if (preparing) {
    return (
      <div className="container page">
        <div className="room-status" role="status" aria-live="polite">
          <span className="spinner" aria-hidden="true" />
          <h2>Preparing your questions…</h2>
          <p className="muted">The AI is tailoring them to your role, experience and details.</p>
        </div>
      </div>
    );
  }

  // AI se sawaal nahi bane (free limit, network, server): dobara try ya setup pe wapas
  if (!interview) {
    return (
      <div className="container page">
        <div className="room-status" role="alert">
          <h2>Couldn&rsquo;t prepare your questions</h2>
          <p className="muted">{ai.prepareError ?? "The AI didn't return any questions."}</p>
          <div className="room-status__actions">
            <button
              type="button"
              className="btn btn--primary"
              onClick={() => dispatch(prepareQuestionsRequest(serverInterview.id))}
            >
              <FiRotateCcw /> Try again
            </button>
            <Link to="/interview" className="btn btn--outline">
              <FiArrowLeft /> Back to setup
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const submitToAi = (done: Finished) => {
    dispatch(
      submitInterviewRequest({
        id: serverInterview.id,
        answers: toSubmitted(interview.questions, done.answers),
        durationSec: done.elapsedSec,
      }),
    );
  };

  const handleFinish = (answers: AnsweredTurn[], elapsedSec: number) => {
    if (!answers.length || !user) {
      navigate("/interview", { replace: true });
      return;
    }
    const done = { answers, elapsedSec };
    setFinished(done);
    submitToAi(done);
  };

  if (finished) {
    return (
      <div className="container page">
        <div className="room-status" role="status" aria-live="polite">
          {ai.submitError ? (
            <>
              <h2>Couldn&rsquo;t score your answers</h2>
              <p className="muted">{ai.submitError}</p>
              <div className="room-status__actions">
                <button type="button" className="btn btn--primary" onClick={() => submitToAi(finished)}>
                  <FiRotateCcw /> Try again
                </button>
                {/* AI ke sawaalon ke keywords se, browser me hi */}
                <button
                  type="button"
                  className="btn btn--outline"
                  onClick={() => saveAndOpenReport(buildReport(finished.answers), finished.elapsedSec)}
                >
                  <FiZap /> Use quick scoring
                </button>
              </div>
            </>
          ) : (
            <>
              <span className="spinner" aria-hidden="true" />
              <h2>Scoring your answers…</h2>
              <p className="muted">The AI is reviewing each answer. This takes a few seconds.</p>
            </>
          )}
        </div>
      </div>
    );
  }

  // Voice answer: recording -> POST /api/interviews/:id/transcribe -> text (sirf AI scoring ke liye).
  // Error DemoRoom us voice note pe hi dikhata hai; 401 pe baaki APIs jaisa logout.
  const transcribe = async (audio: Blob, filename: string) => {
    try {
      const response = await transcribeApi(token, serverInterview.id, audio, filename);
      return response.data.text;
    } catch (err) {
      if (err instanceof ApiRequestError && err.status === 401) {
        dispatch(logout());
        dispatch(showSnackbar({ type: "info", message: "Your session has expired. Please log in again." }));
      }
      throw err;
    }
  };

  return (
    <DemoRoom
      role={interview}
      transcribe={transcribe}
      intro={interview.intro}
      timeLimitFor={(turn, isFollowUp) => answerTimeFor(turn, isFollowUp, config.type, config.difficulty)}
      voiceOn={voiceOn}
      onVoiceChange={setVoiceOn}
      onFinish={handleFinish}
    />
  );
};

export default InterviewRoomPage;

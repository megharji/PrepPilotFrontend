import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import DemoRoom from "./demo/DemoRoom";
import { ADVANCED_ANSWER_LIMIT_SEC } from "../data/interviewSetup";
import { buildInterview } from "../utils/buildInterview";
import { buildReport } from "../utils/demoScoring";
import type { AnsweredTurn } from "../utils/demoScoring";
import { newInterviewId } from "../utils/interviewStats";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { selectCreateInterview, selectCurrentUser, selectInterviewConfig } from "../redux/selector";
import { saveInterview } from "../redux/reducers/Interview/interviewReducer";

// Setup ke baad asli interview. Khatam hone pe save hota hai aur report khulti hai.
const InterviewRoomPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useAppSelector(selectCurrentUser);
  const config = useAppSelector(selectInterviewConfig);
  // Backend (POST /api/interviews) se bana interview
  const serverInterview = useAppSelector(selectCreateInterview).interview;
  const [voiceOn, setVoiceOn] = useState(true);

  // Setup kiye bina (ya refresh ke baad) seedha yahan aaye to wapas setup pe
  if (!config || !serverInterview) return <Navigate to="/interview" replace />;

  const interview = buildInterview(config, user?.name);

  const handleFinish = (answers: AnsweredTurn[], elapsedSec: number) => {
    if (!answers.length || !user) {
      navigate("/interview", { replace: true });
      return;
    }

    const id = newInterviewId();
    dispatch(
      saveInterview({
        userId: user.id,
        record: {
          id,
          serverId: serverInterview.id,
          roleTitle: interview.title,
          createdAt: new Date().toISOString(),
          durationSec: elapsedSec,
          report: buildReport(answers),
          config,
        },
      }),
    );
    navigate(`/history/${id}`, { replace: true });
  };

  return (
    <DemoRoom
      role={interview}
      intro={interview.intro}
      answerTimeLimitSec={config.difficulty === "ADVANCED" ? ADVANCED_ANSWER_LIMIT_SEC : undefined}
      voiceOn={voiceOn}
      onVoiceChange={setVoiceOn}
      onFinish={handleFinish}
    />
  );
};

export default InterviewRoomPage;

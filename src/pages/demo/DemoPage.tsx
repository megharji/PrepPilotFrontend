import { useState } from "react";
import { Link } from "react-router-dom";
import { FiX } from "react-icons/fi";
import Logo from "../../components/Logo";
import ThemeToggle from "../../components/ThemeToggle";
import DemoSetup from "./DemoSetup";
import DemoRoom from "./DemoRoom";
import DemoReportView from "./DemoReportView";
import { DEMO_ROLES } from "../../data/demoInterview";
import type { DemoRoleId } from "../../data/demoInterview";
import { buildReport } from "../../utils/demoScoring";
import type { AnsweredTurn, DemoReport } from "../../utils/demoScoring";
import { useAppSelector } from "../../redux/hooks";
import { selectIsAuthenticated } from "../../redux/selector";

type Phase = "setup" | "interview" | "report";

// Bina login ke demo interview. Sab kuch frontend me, kuch save nahi hota.
const DemoPage = () => {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  const [phase, setPhase] = useState<Phase>("setup");
  const [roleId, setRoleId] = useState<DemoRoleId>("frontend");
  const [voiceOn, setVoiceOn] = useState(true);
  const [report, setReport] = useState<DemoReport | null>(null);
  const [runKey, setRunKey] = useState(0);

  const role = DEMO_ROLES.find((r) => r.id === roleId) ?? DEMO_ROLES[0];

  const handleFinish = (answers: AnsweredTurn[]) => {
    if (!answers.length) {
      setPhase("setup");
      return;
    }
    setReport(buildReport(answers));
    setPhase("report");
    window.scrollTo({ top: 0 });
  };

  const restart = () => {
    setReport(null);
    setRunKey((k) => k + 1);
    setPhase("setup");
    window.scrollTo({ top: 0 });
  };

  return (
    <div className={`demo demo--${phase}`}>
      <header className="demo__bar container">
        <Logo />
        <div className="demo__bar-actions">
          <ThemeToggle />
          <Link to={isAuthenticated ? "/dashboard" : "/"} className="btn btn--ghost btn--sm">
            <FiX /> Exit demo
          </Link>
        </div>
      </header>

      {phase === "setup" && (
        <DemoSetup
          roleId={roleId}
          onRoleChange={setRoleId}
          voiceOn={voiceOn}
          onVoiceChange={setVoiceOn}
          onStart={() => setPhase("interview")}
        />
      )}

      {phase === "interview" && (
        <DemoRoom
          key={runKey}
          role={role}
          voiceOn={voiceOn}
          onVoiceChange={setVoiceOn}
          onFinish={handleFinish}
        />
      )}

      {phase === "report" && report && (
        <DemoReportView
          report={report}
          roleTitle={role.title}
          isAuthenticated={isAuthenticated}
          onRetry={restart}
        />
      )}
    </div>
  );
};

export default DemoPage;

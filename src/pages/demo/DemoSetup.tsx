import { FiArrowRight, FiClock, FiMessageSquare, FiMic, FiVolume2, FiVolumeX } from "react-icons/fi";
import { DEMO_ROLES } from "../../data/demoInterview";
import type { DemoRoleId } from "../../data/demoInterview";

interface DemoSetupProps {
  roleId: DemoRoleId;
  onRoleChange: (id: DemoRoleId) => void;
  voiceOn: boolean;
  onVoiceChange: (on: boolean) => void;
  onStart: () => void;
  badge?: string;
  title?: string;
  description?: string;
}

const DEFAULT_DESCRIPTION =
  "Pick a role and answer like you would in a real interview. The interviewer will ask follow-ups based on what you say, and you’ll get a feedback report at the end.";

// Demo (bina login) aur logged-in interview dono me use hota hai, sirf heading alag
const DemoSetup = ({
  roleId,
  onRoleChange,
  voiceOn,
  onVoiceChange,
  onStart,
  badge = "Free demo · No sign-up needed",
  title = "Try a mock interview",
  description = DEFAULT_DESCRIPTION,
}: DemoSetupProps) => (
  <div className="setup container">
    <div className="setup__head">
      <span className="pill">{badge}</span>
      <h1>{title}</h1>
      <p>{description}</p>
    </div>

    <div className="setup__roles" role="radiogroup" aria-label="Interview role">
      {DEMO_ROLES.map((role) => (
        <button
          key={role.id}
          type="button"
          role="radio"
          aria-checked={role.id === roleId}
          className={`role-card ${role.id === roleId ? "is-selected" : ""}`}

          onClick={() => onRoleChange(role.id)}
        >
          <span className="role-card__radio" aria-hidden="true" />
          <strong>{role.title}</strong>
          <span className="role-card__sub">{role.subtitle}</span>
          <span className="role-card__topics">{role.topics}</span>
        </button>
      ))}
    </div>

    <div className="setup__footer">
      <ul className="setup__info">
        <li>
          <FiMessageSquare /> 3 questions + follow-ups
        </li>
        <li>
          <FiClock /> About 8–10 minutes
        </li>
        <li>
          <FiMic /> Type or speak your answers
        </li>
      </ul>

      <div className="setup__actions">
        <button
          type="button"
          className={`toggle ${voiceOn ? "is-on" : ""}`}
          onClick={() => onVoiceChange(!voiceOn)}
          aria-pressed={voiceOn}
        >
          {voiceOn ? <FiVolume2 /> : <FiVolumeX />}
          Interviewer voice {voiceOn ? "on" : "off"}
        </button>
        <button type="button" className="btn btn--primary btn--lg" onClick={onStart}>
          Start interview <FiArrowRight />
        </button>
      </div>
    </div>
  </div>
);

export default DemoSetup;

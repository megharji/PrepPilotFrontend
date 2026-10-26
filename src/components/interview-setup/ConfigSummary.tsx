import {
  INTERVIEW_TYPES,
  TARGET_ROLES,
  difficultyLabel,
  experienceLabel,
  labelOf,
} from "../../data/interviewSetup";
import type { InterviewConfig } from "../../types/interview.types";

// Chhoti chips: role · experience · type · difficulty · kis cheez pe tailor hua
// Setup ke last step aur report page dono pe
const ConfigSummary = ({ config }: { config: InterviewConfig }) => {
  const hasJd = !!config.jobDescription?.trim();
  const hasResume = !!config.resume;

  return (
    <ul className="config-chips" aria-label="Interview settings">
      <li>{labelOf(TARGET_ROLES, config.targetRole)}</li>
      {config.techStack && <li>{config.techStack}</li>}
      <li>{experienceLabel(config.experienceYears)}</li>
      <li>{labelOf(INTERVIEW_TYPES, config.type)}</li>
      <li>{difficultyLabel(config.difficulty, config.type)}</li>
      {hasJd && <li>Job description</li>}
      {hasResume && <li>{config.resume!.name}</li>}
      {!hasJd && !hasResume && <li className="is-off">General questions</li>}
    </ul>
  );
};

export default ConfigSummary;

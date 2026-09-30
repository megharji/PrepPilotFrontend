import ChoiceCards from "./ChoiceCards";
import { TARGET_ROLES } from "../../data/interviewSetup";
import type { TargetRoleId } from "../../types/interview.types";

interface StepRoleProps {
  value: TargetRoleId | null;
  onChange: (value: TargetRoleId) => void;
}

const StepRole = ({ value, onChange }: StepRoleProps) => (
  <div className="step-body">
    <h2>Which role are you preparing for?</h2>
    <p className="step-body__sub">The questions will match what this role is usually asked.</p>
    <ChoiceCards label="Target role" options={TARGET_ROLES} value={value} onChange={onChange} />
  </div>
);

export default StepRole;

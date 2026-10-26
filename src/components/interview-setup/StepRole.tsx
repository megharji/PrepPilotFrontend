import { useState } from "react";
import ChoiceCards from "./ChoiceCards";
import { TARGET_ROLES, TECH_STACKS, TECH_STACK_MAX_LENGTH } from "../../data/interviewSetup";
import type { TargetRoleId } from "../../types/interview.types";

interface StepRoleProps {
  value: TargetRoleId | null;
  techStack: string;
  onChange: (value: TargetRoleId) => void;
  onTechStackChange: (value: string) => void;
}

// Role chuno, phir uski language / framework. List me na ho to "Other" me khud likho.
const StepRole = ({ value, techStack, onChange, onTechStackChange }: StepRoleProps) => {
  const options = value ? TECH_STACKS[value] : [];
  // Wapas is step pe aaye aur pehle khud likha tha to "Other" khula rahe
  const [otherOpen, setOtherOpen] = useState(() => !!techStack && !options.includes(techStack));

  const changeRole = (role: TargetRoleId) => {
    if (role === value) return;
    setOtherOpen(false);
    onChange(role);
  };

  const pick = (tech: string) => {
    setOtherOpen(false);
    onTechStackChange(tech);
  };

  const openOther = () => {
    setOtherOpen(true);
    onTechStackChange("");
  };

  return (
    <div className="step-body">
      <h2>Which role are you preparing for?</h2>
      <p className="step-body__sub">The questions will match what this role is usually asked.</p>
      <ChoiceCards label="Target role" options={TARGET_ROLES} value={value} onChange={changeRole} />

      {value && (
        <>
          <h2 className="step-body__second">Which language or framework?</h2>
          <p className="step-body__sub">Pick the one you work with. Not in the list? Choose Other and type it.</p>
          <div className="presets" role="radiogroup" aria-label="Language or framework">
            {options.map((tech) => (
              <button
                key={tech}
                type="button"
                role="radio"
                aria-checked={!otherOpen && techStack === tech}
                className={`preset ${!otherOpen && techStack === tech ? "is-selected" : ""}`}
                onClick={() => pick(tech)}
              >
                {tech}
              </button>
            ))}
            <button
              type="button"
              role="radio"
              aria-checked={otherOpen}
              className={`preset ${otherOpen ? "is-selected" : ""}`}
              onClick={openOther}
            >
              Other
            </button>
          </div>

          {otherOpen && (
            <label className="tech-other">
              <span className="sr-only">Your language or framework</span>
              <input
                type="text"
                className="tech-other__input"
                placeholder="e.g. Svelte, Ruby on Rails, Kotlin"
                maxLength={TECH_STACK_MAX_LENGTH}
                value={techStack}
                onChange={(e) => onTechStackChange(e.target.value)}
                autoFocus
              />
            </label>
          )}
        </>
      )}
    </div>
  );
};

export default StepRole;

import { FiCheck } from "react-icons/fi";
import { PERSONALIZE_SOURCES, toPersonalization, usesJd, usesResume } from "../../data/interviewSetup";
import type { Personalization } from "../../types/interview.types";

interface StepPersonalizeProps {
  value: Personalization;
  onChange: (value: Personalization) => void;
}

// Do checkbox: JD aur Resume. Dono, koi ek, ya koi nahi, sab chalega
const StepPersonalize = ({ value, onChange }: StepPersonalizeProps) => {
  const checked = { JD: usesJd(value), RESUME: usesResume(value) };

  const toggle = (id: keyof typeof checked) => {
    const next = { ...checked, [id]: !checked[id] };
    onChange(toPersonalization(next.JD, next.RESUME));
  };

  return (
    <div className="step-body">
      <h2>What should we tailor your interview to?</h2>
      <p className="step-body__sub">
        Pick one, both, or neither. With neither, you get general questions for your role and experience.
      </p>
      <fieldset className="choices choices--2">
        <legend className="sr-only">Personalize interview</legend>
        {PERSONALIZE_SOURCES.map((opt) => (
          <label key={opt.id} className={`choice ${checked[opt.id] ? "is-selected" : ""}`}>
            <input
              type="checkbox"
              checked={checked[opt.id]}
              onChange={() => toggle(opt.id)}
              className="sr-only"
            />
            <span className="choice__check" aria-hidden="true">
              <FiCheck />
            </span>
            <strong>{opt.title}</strong>
            <span className="choice__desc">{opt.description}</span>
          </label>
        ))}
      </fieldset>
    </div>
  );
};

export default StepPersonalize;

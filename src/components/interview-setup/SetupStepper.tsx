import { FiCheck } from "react-icons/fi";
import type { SetupStep } from "../../data/interviewSetup";

interface SetupStepperProps {
  steps: SetupStep[];
  current: number;
  // Pichhle steps pe click karke wapas ja sakte hain
  onJump: (step: number) => void;
}

const SetupStepper = ({ steps, current, onJump }: SetupStepperProps) => (
  <ol className="stepper" aria-label="Interview setup steps">
    {steps.map((step, i) => {
      const state = i < current ? "is-done" : i === current ? "is-current" : "";
      return (
        <li key={step.id} className={`stepper__item ${state}`}>
          <button
            type="button"
            className="stepper__btn"
            onClick={() => onJump(i)}
            disabled={i > current}
            aria-current={i === current ? "step" : undefined}
          >
            <span className="stepper__num">{i < current ? <FiCheck /> : i + 1}</span>
            <span className="stepper__text">
              <span className="stepper__title">{step.title}</span>
              <span className="stepper__hint">{step.hint}</span>
            </span>
          </button>
        </li>
      );
    })}
  </ol>
);

export default SetupStepper;

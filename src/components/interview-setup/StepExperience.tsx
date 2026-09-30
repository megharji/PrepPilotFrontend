import { FiMinus, FiPlus } from "react-icons/fi";
import {
  EXPERIENCE_MAX,
  EXPERIENCE_MIN,
  EXPERIENCE_PRESETS,
  experienceLabel,
} from "../../data/interviewSetup";

interface StepExperienceProps {
  value: number | null;
  onChange: (value: number) => void;
}

const clamp = (n: number) => Math.min(EXPERIENCE_MAX, Math.max(EXPERIENCE_MIN, Math.round(n)));

// Backend ko poora number chahiye (0–50), isliye buckets ki jagah counter
const StepExperience = ({ value, onChange }: StepExperienceProps) => (
  <div className="step-body">
    <h2>How many years of experience do you have?</h2>
    <p className="step-body__sub">
      Interviewers expect different depth from a fresher and a senior engineer. Choose 0 if you&rsquo;re a
      fresher.
    </p>

    <div className="years">
      <button
        type="button"
        className="icon-btn years__btn"
        onClick={() => onChange(clamp((value ?? 0) - 1))}
        disabled={value === null || value <= EXPERIENCE_MIN}
        aria-label="Decrease years"
      >
        <FiMinus />
      </button>
      <label className="years__field">
        <input
          type="number"
          inputMode="numeric"
          min={EXPERIENCE_MIN}
          max={EXPERIENCE_MAX}
          value={value ?? ""}
          placeholder="0"
          onChange={(e) => {
            if (e.target.value === "") return;
            onChange(clamp(Number(e.target.value)));
          }}
          aria-label="Years of experience"
        />
        <span>{value === null ? "years" : experienceLabel(value)}</span>
      </label>
      <button
        type="button"
        className="icon-btn years__btn"
        onClick={() => onChange(clamp((value ?? -1) + 1))}
        disabled={value !== null && value >= EXPERIENCE_MAX}
        aria-label="Increase years"
      >
        <FiPlus />
      </button>
    </div>

    <div className="presets" aria-label="Quick picks">
      {EXPERIENCE_PRESETS.map((n) => (
        <button
          key={n}
          type="button"
          className={`preset ${value === n ? "is-selected" : ""}`}
          onClick={() => onChange(n)}
        >
          {n === 0
            ? "Fresher"
            : `${n}${n === EXPERIENCE_PRESETS[EXPERIENCE_PRESETS.length - 1] ? "+" : ""} yrs`}
        </button>
      ))}
    </div>
  </div>
);

export default StepExperience;

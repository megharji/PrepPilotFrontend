import { JD_MAX_LENGTH, JD_MIN_LENGTH } from "../../data/interviewSetup";

interface StepJobDescriptionProps {
  value: string;
  onChange: (value: string) => void;
}

const StepJobDescription = ({ value, onChange }: StepJobDescriptionProps) => (
  <div className="step-body">
    <h2>Paste the job description</h2>
    <p className="step-body__sub">
      Copy it from the job post. It helps tailor the interview to the skills this company is hiring for.
    </p>
    <label htmlFor="jd" className="sr-only">
      Job description
    </label>
    <textarea
      id="jd"
      className="jd-input"
      rows={10}
      maxLength={JD_MAX_LENGTH}
      placeholder={
        "e.g. We're looking for a Frontend Developer with 2+ years of React experience, strong JavaScript fundamentals, and experience building responsive, accessible UIs…"
      }
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
    <div className="jd-count">
      {value.trim().length < JD_MIN_LENGTH && (
        <span className="jd-count__hint">At least {JD_MIN_LENGTH} characters</span>
      )}
      <span>
        {value.length.toLocaleString()} / {JD_MAX_LENGTH.toLocaleString()}
      </span>
    </div>
  </div>
);

export default StepJobDescription;

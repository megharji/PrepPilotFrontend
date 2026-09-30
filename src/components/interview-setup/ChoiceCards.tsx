import type { Option } from "../../data/interviewSetup";

interface ChoiceCardsProps<T extends string> {
  label: string;
  options: Option<T>[];
  value: T | null;
  onChange: (value: T) => void;
  columns?: 2 | 3 | 4;
}

// Radio buttons, card ki shakal me. Arrow keys se bhi chalta hai (native radio).
const ChoiceCards = <T extends string>({
  label,
  options,
  value,
  onChange,
  columns = 3,
}: ChoiceCardsProps<T>) => (
  <fieldset className={`choices choices--${columns}`}>
    <legend className="sr-only">{label}</legend>
    {options.map((opt) => (
      <label key={opt.id} className={`choice ${value === opt.id ? "is-selected" : ""}`}>
        <input
          type="radio"
          name={label}
          value={opt.id}
          checked={value === opt.id}
          onChange={() => onChange(opt.id)}
          className="sr-only"
        />
        <span className="choice__radio" aria-hidden="true" />
        <strong>{opt.title}</strong>
        <span className="choice__desc">{opt.description}</span>
      </label>
    ))}
  </fieldset>
);

export default ChoiceCards;

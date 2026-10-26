import ChoiceCards from "./ChoiceCards";
import { INTERVIEW_TYPES, difficultyOptions } from "../../data/interviewSetup";
import type { Difficulty, InterviewType } from "../../types/interview.types";

interface StepTypeDifficultyProps {
  type: InterviewType;
  difficulty: Difficulty;
  onTypeChange: (value: InterviewType) => void;
  onDifficultyChange: (value: Difficulty) => void;
}

const StepTypeDifficulty = ({
  type,
  difficulty,
  onTypeChange,
  onDifficultyChange,
}: StepTypeDifficultyProps) => {
  const isCoding = type === "CODING";

  return (
    <div className="step-body">
      <h2>Interview type</h2>
      <p className="step-body__sub">Which round do you want to practise?</p>
      <ChoiceCards
        label="Interview type"
        options={INTERVIEW_TYPES}
        value={type}
        onChange={onTypeChange}
        columns={3}
      />

      {/* Coding me Basic / Medium / Hard, baaki me Beginner / Intermediate / Advanced (values same) */}
      <h2 className="step-body__second">Difficulty</h2>
      <p className="step-body__sub">
        {isCoding
          ? "Pick how tough the problems should be."
          : "Harder interviews push back more, just like a tough panel."}
      </p>
      <ChoiceCards
        label="Difficulty"
        options={difficultyOptions(type)}
        value={difficulty}
        onChange={onDifficultyChange}
      />
    </div>
  );
};

export default StepTypeDifficulty;

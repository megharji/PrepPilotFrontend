import ChoiceCards from "./ChoiceCards";
import { DIFFICULTIES, INTERVIEW_TYPES } from "../../data/interviewSetup";
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
}: StepTypeDifficultyProps) => (
  <div className="step-body">
    <h2>Interview type</h2>
    <p className="step-body__sub">Which round do you want to practise?</p>
    <ChoiceCards
      label="Interview type"
      options={INTERVIEW_TYPES}
      value={type}
      onChange={onTypeChange}
      columns={4}
    />

    <h2 className="step-body__second">Difficulty</h2>
    <p className="step-body__sub">Harder interviews push back more, just like a tough panel.</p>
    <ChoiceCards label="Difficulty" options={DIFFICULTIES} value={difficulty} onChange={onDifficultyChange} />
  </div>
);

export default StepTypeDifficulty;

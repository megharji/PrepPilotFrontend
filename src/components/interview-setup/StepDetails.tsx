import StepJobDescription from "./StepJobDescription";
import StepResume from "./StepResume";
import { usesJd, usesResume } from "../../data/interviewSetup";
import type { Personalization } from "../../types/interview.types";

interface StepDetailsProps {
  personalization: Personalization;
  jobDescription: string;
  onJobDescriptionChange: (value: string) => void;
}

// Personalize step me jo chuna, sirf wahi maangte hain
const StepDetails = ({ personalization, jobDescription, onJobDescriptionChange }: StepDetailsProps) => (
  <>
    {usesJd(personalization) && (
      <StepJobDescription value={jobDescription} onChange={onJobDescriptionChange} />
    )}
    {personalization === "BOTH" && <hr className="step-divider" />}
    {usesResume(personalization) && <StepResume />}
  </>
);

export default StepDetails;

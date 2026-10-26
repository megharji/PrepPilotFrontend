import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft, FiArrowRight, FiPlay } from "react-icons/fi";
import SetupStepper from "../components/interview-setup/SetupStepper";
import StepRole from "../components/interview-setup/StepRole";
import StepExperience from "../components/interview-setup/StepExperience";
import StepPersonalize from "../components/interview-setup/StepPersonalize";
import StepDetails from "../components/interview-setup/StepDetails";
import StepTypeDifficulty from "../components/interview-setup/StepTypeDifficulty";
import ConfigSummary from "../components/interview-setup/ConfigSummary";
import {
  JD_MIN_LENGTH,
  TARGET_ROLES,
  getSetupSteps,
  labelOf,
  usesJd,
  usesResume,
} from "../data/interviewSetup";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { selectCreateInterview, selectInterviewConfig, selectResumeUpload } from "../redux/selector";
import { setInterviewConfig } from "../redux/reducers/Interview/interviewSetupReducer";
import {
  createInterviewRequest,
  resetCreateInterview,
} from "../redux/reducers/Interview/createInterviewReducer";
import type { InterviewConfig, TargetRoleId } from "../types/interview.types";

// Resume redux (upload state) me rehta hai, isliye draft me nahi.
// Role/experience shuru me khaali, baaki ke default.
// Personalization NONE se shuru (dono checkbox khaali = general questions)
type Draft = Omit<InterviewConfig, "targetRole" | "experienceYears" | "resume"> & {
  targetRole: TargetRoleId | null;
  experienceYears: number | null;
};

const EMPTY_DRAFT: Draft = {
  targetRole: null,
  techStack: "",
  experienceYears: null,
  personalization: "NONE",
  jobDescription: "",
  type: "TECHNICAL",
  difficulty: "INTERMEDIATE",
};

const InterviewSetupPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const previous = useAppSelector(selectInterviewConfig);
  const resumeUpload = useAppSelector(selectResumeUpload);
  // Create ka success/error snackbar me aata hai (createInterviewSaga)
  const { loading: creating, interview: created } = useAppSelector(selectCreateInterview);

  // Pichhla setup ho to wahi values se shuru (dobara interview dena aasaan)
  const [draft, setDraft] = useState<Draft>(() => ({ ...EMPTY_DRAFT, ...previous }));
  const [stepIndex, setStepIndex] = useState(0);
  // Isi page se Start dabaya ho tabhi room kholo (purane success pe nahi)
  const submitted = useRef(false);

  // Pichhle attempt ka error/loading saaf
  useEffect(() => {
    dispatch(resetCreateInterview());
  }, [dispatch]);

  // Backend ne interview bana diya -> interview room
  useEffect(() => {
    if (created && submitted.current) navigate("/interview/live");
  }, [created, navigate]);

  // Khaali (purana draft/config) = koi checkbox tick nahi = NONE.
  // Warna UI "neither" dikhata hai par config null ho jaata aur Start disabled rehta.
  const personalization = draft.personalization ?? "NONE";

  const steps = getSetupSteps(personalization);
  const lastIndex = steps.length - 1;
  const step = steps[Math.min(stepIndex, lastIndex)];
  const isLast = step.id === "type";

  const update = <K extends keyof Draft>(key: K, value: Draft[K]) =>
    setDraft((d) => ({ ...d, [key]: value }));

  // Role badla to purana tech hata do (har role ki list alag hai)
  const changeRole = (role: TargetRoleId) => setDraft((d) => ({ ...d, targetRole: role, techStack: "" }));

  // Purane saved config me techStack nahi tha
  const techStack = (draft.techStack ?? "").trim();

  const needsJd = usesJd(personalization);
  const needsResume = usesResume(personalization);
  const jdReady = !needsJd || draft.jobDescription.trim().length >= JD_MIN_LENGTH;
  const resumeReady = !needsResume || (!!resumeUpload.resume && !resumeUpload.loading);

  // Har step ka "aage ja sakte hain?" check
  const canContinue = {
    role: !!draft.targetRole && !!techStack,
    experience: typeof draft.experienceYears === "number",
    // Kuch bhi tick na ho to bhi aage (general questions)
    personalize: true,
    details: jdReady && resumeReady,
    type: true,
  }[step.id];

  // Details step pe kya missing hai, wo batana
  const detailsHint = !jdReady
    ? `Add a job description of at least ${JD_MIN_LENGTH} characters to continue.`
    : !resumeReady
      ? "Upload your resume to continue."
      : "";

  const config: InterviewConfig | null =
    draft.targetRole && techStack && typeof draft.experienceYears === "number"
      ? {
          ...draft,
          targetRole: draft.targetRole,
          techStack,
          experienceYears: draft.experienceYears,
          personalization,
          // Jo chuna hi nahi, wo nahi bhejte (chahe pehle bhara ho)
          jobDescription: needsJd ? draft.jobDescription.trim() : "",
          resume:
            needsResume && resumeUpload.resume
              ? {
                  id: resumeUpload.resume.id,
                  name: resumeUpload.resume.originalName,
                  size: resumeUpload.resume.sizeBytes,
                }
              : null,
        }
      : null;

  const ready = !!config && jdReady && resumeReady;

  const next = () => {
    if (canContinue) setStepIndex((i) => Math.min(i + 1, lastIndex));
  };

  const back = () => {
    if (stepIndex === 0) navigate("/dashboard");
    else setStepIndex((i) => i - 1);
  };

  const start = () => {
    if (!config || !ready || creating) return;
    submitted.current = true;
    dispatch(setInterviewConfig(config));
    // POST /api/interviews
    dispatch(
      createInterviewRequest({
        targetRole: labelOf(TARGET_ROLES, config.targetRole),
        techStack: config.techStack,
        experienceYears: config.experienceYears,
        jobDescription: config.jobDescription || undefined,
        resumeId: config.resume?.id,
        interviewType: config.type,
        difficulty: config.difficulty,
      }),
    );
  };

  return (
    <div className="container setup-page">
      <header className="page__head">
        <h1>Interview Setup</h1>
        <p>A few quick steps and your interviewer will be ready.</p>
      </header>

      <div className="setup-layout">
        <aside>
          <SetupStepper steps={steps} current={stepIndex} onJump={setStepIndex} />
        </aside>

        <section className="setup-panel">
          <span className="setup-panel__count">
            Step {stepIndex + 1} of {steps.length}
          </span>

          {step.id === "role" && (
            <StepRole
              value={draft.targetRole}
              techStack={draft.techStack ?? ""}
              onChange={changeRole}
              onTechStackChange={(v) => update("techStack", v)}
            />
          )}
          {step.id === "experience" && (
            <StepExperience value={draft.experienceYears} onChange={(v) => update("experienceYears", v)} />
          )}
          {step.id === "personalize" && (
            <StepPersonalize value={personalization} onChange={(v) => update("personalization", v)} />
          )}
          {step.id === "details" && (
            <StepDetails
              personalization={personalization}
              jobDescription={draft.jobDescription}
              onJobDescriptionChange={(v) => update("jobDescription", v)}
            />
          )}
          {step.id === "type" && (
            <StepTypeDifficulty
              type={draft.type}
              difficulty={draft.difficulty}
              onTypeChange={(v) => update("type", v)}
              onDifficultyChange={(v) => update("difficulty", v)}
            />
          )}

          {isLast && config && (
            <div className="setup-review">
              <span className="setup-review__label">Your interview</span>
              <ConfigSummary config={config} />
            </div>
          )}

          <footer className="setup-panel__nav">
            <button type="button" className="btn btn--ghost" onClick={back} disabled={creating}>
              <FiArrowLeft /> {stepIndex === 0 ? "Dashboard" : "Back"}
            </button>

            <div className="setup-panel__right">
              {step.id === "details" && detailsHint && <span className="setup-hint">{detailsHint}</span>}
              {!isLast ? (
                <button type="button" className="btn btn--primary" onClick={next} disabled={!canContinue}>
                  Continue <FiArrowRight />
                </button>
              ) : (
                <button
                  type="button"
                  className="btn btn--primary btn--lg"
                  onClick={start}
                  disabled={!ready || creating}
                >
                  {creating ? (
                    <>
                      <span className="spinner" aria-hidden="true" /> Setting up…
                    </>
                  ) : (
                    <>
                      <FiPlay /> Start Interview
                    </>
                  )}
                </button>
              )}
            </div>
          </footer>
        </section>
      </div>
    </div>
  );
};

export default InterviewSetupPage;

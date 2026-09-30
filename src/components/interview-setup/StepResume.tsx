import { useRef, useState } from "react";
import type { ChangeEvent, DragEvent } from "react";
import { FiCheckCircle, FiFileText, FiUploadCloud, FiX } from "react-icons/fi";
import Alert from "../Alert";
import { RESUME_ACCEPT, RESUME_MAX_BYTES } from "../../data/interviewSetup";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { selectResumeUpload } from "../../redux/selector";
import { clearResume, uploadResumeRequest } from "../../redux/reducers/Resume/resumeReducer";

const ALLOWED_EXT = RESUME_ACCEPT.split(",");

const formatSize = (bytes: number) =>
  bytes < 1024 * 1024 ? `${Math.round(bytes / 1024)} KB` : `${(bytes / 1024 / 1024).toFixed(1)} MB`;

// File chunte hi POST /api/resumes pe upload (redux saga se). Uploaded resume redux me rehta hai.
const StepResume = () => {
  const dispatch = useAppDispatch();
  // Upload ka success/error snackbar me aata hai (resumeSaga); yahan sirf file type/size ki galti
  const { loading, resume } = useAppSelector(selectResumeUpload);

  const inputRef = useRef<HTMLInputElement>(null);
  const [localError, setLocalError] = useState("");
  const [dragging, setDragging] = useState(false);
  const [uploadingName, setUploadingName] = useState("");

  const pick = (file?: File) => {
    if (!file || loading) return;
    // Backend jaise hi checks, taaki bekaar request na jaaye
    const ext = file.name.slice(file.name.lastIndexOf(".")).toLowerCase();
    if (!ALLOWED_EXT.includes(ext)) {
      setLocalError("Only PDF or DOCX files are allowed.");
      return;
    }
    if (file.size > RESUME_MAX_BYTES) {
      setLocalError("File too large (max 5 MB).");
      return;
    }
    setLocalError("");
    setUploadingName(file.name);
    dispatch(uploadResumeRequest(file));
  };

  const handleInput = (e: ChangeEvent<HTMLInputElement>) => {
    pick(e.target.files?.[0]);
    e.target.value = "";
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);
    pick(e.dataTransfer.files?.[0]);
  };

  return (
    <div className="step-body">
      <h2>Upload your resume</h2>
      <p className="step-body__sub">
        Real interviewers ask about your own projects. Your resume lets us do the same.
      </p>

      {localError && <Alert variant="error">{localError}</Alert>}

      {loading ? (
        <div className="file-chip is-uploading" aria-live="polite">
          <span className="file-chip__icon">
            <span className="spinner spinner--brand" aria-hidden="true" />
          </span>
          <span className="file-chip__info">
            <strong>{uploadingName}</strong>
            <span>Uploading…</span>
          </span>
        </div>
      ) : resume ? (
        <div className="file-chip">
          <span className="file-chip__icon">
            <FiFileText />
          </span>
          <span className="file-chip__info">
            <strong>{resume.originalName}</strong>
            <span className="file-chip__ok">
              <FiCheckCircle /> Uploaded · {formatSize(resume.sizeBytes)}
            </span>
          </span>
          <button
            type="button"
            className="icon-btn"
            onClick={() => dispatch(clearResume())}
            aria-label="Remove resume"
            title="Use a different resume"
          >
            <FiX />
          </button>
        </div>
      ) : (
        <div
          className={`dropzone ${dragging ? "is-dragging" : ""}`}
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
        >
          <FiUploadCloud className="dropzone__icon" />
          <p>
            <strong>Drag and drop your resume here</strong>
          </p>
          <p className="dropzone__hint">PDF or DOCX · up to 5 MB</p>
          <button
            type="button"
            className="btn btn--outline btn--sm"
            onClick={() => inputRef.current?.click()}
          >
            Browse files
          </button>
          <input
            ref={inputRef}
            type="file"
            accept={RESUME_ACCEPT}
            onChange={handleInput}
            className="sr-only"
            tabIndex={-1}
          />
        </div>
      )}

      <p className="step-note">
        Your resume is stored securely on the server. Questions based on it arrive with the AI interviewer.
      </p>
    </div>
  );
};

export default StepResume;

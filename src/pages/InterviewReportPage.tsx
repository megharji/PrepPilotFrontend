import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { FiArrowLeft, FiInfo, FiPlay, FiTrash2 } from "react-icons/fi";
import ConfirmDialog from "../components/ConfirmDialog";
import DemoReportView from "./demo/DemoReportView";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import {
  selectDeleteInterview,
  selectInterviewDetail,
  selectLocalReportsByServerId,
} from "../redux/selector";
import { deleteInterviewRequest } from "../redux/reducers/Interview/deleteInterviewReducer";
import { getInterviewRequest } from "../redux/reducers/Interview/interviewDetailReducer";
import { formatDateTime } from "../utils/interviewStats";
import {
  INTERVIEW_TYPES,
  STATUS_LABELS,
  difficultyLabel,
  experienceLabel,
  labelOf,
} from "../data/interviewSetup";

const JD_PREVIEW = 280;

// History me se ek interview: details GET /api/interviews/:id se, report (score) is device se
const InterviewReportPage = () => {
  const { id: rawId = "" } = useParams();
  const id = /^\d+$/.test(rawId) ? Number(rawId) : null;

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { interview, loading, error } = useAppSelector(selectInterviewDetail);
  const local = useAppSelector(selectLocalReportsByServerId).get(id ?? -1);
  const [showFullJd, setShowFullJd] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const { deletingId, lastDeletedId } = useAppSelector(selectDeleteInterview);

  // Ye interview delete ho gaya -> History
  useEffect(() => {
    if (id !== null && lastDeletedId === id) navigate("/history", { replace: true });
  }, [id, lastDeletedId, navigate]);

  useEffect(() => {
    if (id !== null) dispatch(getInterviewRequest(id));
  }, [dispatch, id]);

  const back = (
    <Link to="/history" className="text-link">
      <FiArrowLeft /> All interviews
    </Link>
  );

  if (id === null || (!loading && (error || !interview))) {
    return (
      <div className="container page">
        <div className="empty">
          <p>{id === null ? "This interview link is not valid." : (error ?? "Interview not found.")}</p>
          <Link to="/history" className="btn btn--outline btn--sm">
            Back to history
          </Link>
        </div>
      </div>
    );
  }

  if (loading || !interview) {
    return (
      <div className="container page">
        <div className="detail-card detail-card--skeleton" aria-busy="true" aria-label="Loading interview" />
      </div>
    );
  }

  const report = interview.report ?? local?.report;
  const jd = interview.jobDescription ?? "";
  const jdLong = jd.length > JD_PREVIEW;

  return (
    <>
      <div className="container report-back">
        {back}
        <div className="report-back__right">
          <span className="muted">{formatDateTime(interview.createdAt)}</span>
          <button
            type="button"
            className="btn btn--ghost btn--sm btn--danger-ghost"
            onClick={() => setConfirmDelete(true)}
            disabled={deletingId === interview.id}
          >
            <FiTrash2 /> Delete
          </button>
        </div>
      </div>

      <ConfirmDialog
        open={confirmDelete}
        title="Delete this interview?"
        message={
          <>
            <strong>{interview.targetRole}</strong> from {formatDateTime(interview.createdAt)} and its report
            will be permanently deleted. This can&rsquo;t be undone.
          </>
        }
        loading={deletingId === interview.id}
        onConfirm={() => dispatch(deleteInterviewRequest(interview.id))}
        onCancel={() => setConfirmDelete(false)}
      />

      <div className="container detail-wrap">
        <section className="detail-card">
          <div className="detail-card__head">
            <div>
              <span className="detail-card__label">Interview #{interview.id}</span>
              <h1>{interview.targetRole}</h1>
            </div>
            <span className={`status-pill status-pill--${interview.status.toLowerCase()}`}>
              {STATUS_LABELS[interview.status] ?? interview.status}
            </span>
          </div>

          <dl className="detail-grid">
            {interview.techStack && (
              <div>
                <dt>Language / framework</dt>
                <dd>{interview.techStack}</dd>
              </div>
            )}
            <div>
              <dt>Experience</dt>
              <dd>{experienceLabel(interview.experienceYears)}</dd>
            </div>
            <div>
              <dt>Type</dt>
              <dd>{labelOf(INTERVIEW_TYPES, interview.interviewType)}</dd>
            </div>
            <div>
              <dt>Difficulty</dt>
              <dd>{difficultyLabel(interview.difficulty, interview.interviewType)}</dd>
            </div>
            <div>
              <dt>Resume</dt>
              <dd>
                {interview.resumeId
                  ? (local?.config?.resume?.name ?? `Attached (#${interview.resumeId})`)
                  : "Not used"}
              </dd>
            </div>
          </dl>

          <div className="detail-jd">
            <span className="detail-card__label">Job description</span>
            {jd ? (
              <>
                <p>{showFullJd || !jdLong ? jd : `${jd.slice(0, JD_PREVIEW)}…`}</p>
                {jdLong && (
                  <button type="button" className="text-link" onClick={() => setShowFullJd((v) => !v)}>
                    {showFullJd ? "Show less" : "Show full description"}
                  </button>
                )}
              </>
            ) : (
              <p className="muted">Not used. Questions were general for the role.</p>
            )}
          </div>
        </section>
      </div>

      {/* Server ki AI report pehle (har device pe), warna is device pe saved report */}
      {report ? (
        <DemoReportView
          report={report}
          roleTitle={local?.roleTitle ?? interview.targetRole}
          isAuthenticated
          label="Interview report"
          onRetry={() => navigate("/interview")}
        />
      ) : (
        <div className="container detail-wrap">
          <div className="notice detail-notice">
            <FiInfo />
            <span>
              No report for this interview yet. It wasn&rsquo;t finished, or it was scored with quick scoring
              on another device.
            </span>
          </div>
          <Link to="/interview" className="btn btn--primary">
            <FiPlay /> Start a new interview
          </Link>
        </div>
      )}
    </>
  );
};

export default InterviewReportPage;

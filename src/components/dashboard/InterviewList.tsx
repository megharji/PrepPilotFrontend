import { useState } from "react";
import { Link } from "react-router-dom";
import { FiBriefcase, FiChevronRight, FiFileText, FiTrash2 } from "react-icons/fi";
import ConfirmDialog from "../ConfirmDialog";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { selectDeleteInterview } from "../../redux/selector";
import { deleteInterviewRequest } from "../../redux/reducers/Interview/deleteInterviewReducer";
import type { InterviewRecord, ServerInterview } from "../../types/interview.types";
import { formatDateTime } from "../../utils/interviewStats";
import {
  INTERVIEW_TYPES,
  STATUS_LABELS,
  difficultyLabel,
  experienceLabel,
  labelOf,
} from "../../data/interviewSetup";

const scoreTone = (score: number) => (score >= 7 ? "is-good" : score >= 4 ? "is-mid" : "is-low");

interface InterviewListProps {
  // GET /api/interviews se
  interviews: ServerInterview[];
  // serverId -> is browser me save hui report (jab server pe AI score na ho)
  reports: Map<number, InterviewRecord>;
  loading?: boolean;
  emptyText: string;
}

const SkeletonRows = () => (
  <ul className="interview-list" aria-busy="true" aria-label="Loading interviews">
    {[0, 1, 2].map((i) => (
      <li key={i} className="interview-row interview-row--skeleton" />
    ))}
  </ul>
);

// Dashboard (recent) aur History (sab) dono me same list
const InterviewList = ({ interviews, reports, loading = false, emptyText }: InterviewListProps) => {
  const dispatch = useAppDispatch();
  const { deletingId, lastDeletedId } = useAppSelector(selectDeleteInterview);
  // Kis interview ke liye "pakka delete?" popup khula hai
  const [picked, setPicked] = useState<ServerInterview | null>(null);
  // Delete ho gaya to popup apne aap band (fail hua to khula rehta hai, snackbar error batata hai)
  const confirming = picked && lastDeletedId !== picked.id ? picked : null;

  if (loading && !interviews.length) return <SkeletonRows />;

  if (!interviews.length) {
    return (
      <div className="empty">
        <p>{emptyText}</p>
        <Link to="/interview" className="btn btn--outline btn--sm">
          Start your first interview
        </Link>
      </div>
    );
  }

  return (
    <>
      <ul className="interview-list">
        {interviews.map((item) => {
          // Server ka AI score pehle (har device pe), warna is browser me saved report ka
          const score = item.overallScore ?? reports.get(item.id)?.report.overall ?? null;
          return (
            <li key={item.id} className="interview-item">
              <Link to={`/history/${item.id}`} className="interview-row">
                {score !== null ? (
                  <span className={`score-pill ${scoreTone(score)}`}>{score}/10</span>
                ) : (
                  <span className={`status-pill status-pill--${item.status.toLowerCase()}`}>
                    {STATUS_LABELS[item.status] ?? item.status}
                  </span>
                )}
                <span className="interview-row__main">
                  <strong>
                    {item.targetRole}
                    {item.techStack && ` · ${item.techStack}`}
                    <span className="interview-row__tag">
                      {labelOf(INTERVIEW_TYPES, item.interviewType)} ·{" "}
                      {difficultyLabel(item.difficulty, item.interviewType)}
                    </span>
                  </strong>
                  <span className="interview-row__meta">
                    {formatDateTime(item.createdAt)}
                    <span>
                      <FiBriefcase /> {experienceLabel(item.experienceYears)}
                    </span>
                    {(item.jobDescription || item.resumeId) && (
                      <span>
                        <FiFileText />{" "}
                        {[item.jobDescription && "JD", item.resumeId && "Resume"].filter(Boolean).join(" + ")}
                      </span>
                    )}
                  </span>
                </span>
                <FiChevronRight className="interview-row__chev" aria-hidden="true" />
              </Link>
              {/* Link ke bahar, taaki click pe interview na khule */}
              <button
                type="button"
                className="icon-btn interview-item__delete"
                onClick={() => setPicked(item)}
                disabled={deletingId === item.id}
                aria-label={`Delete interview: ${item.targetRole}`}
                title="Delete interview"
              >
                <FiTrash2 />
              </button>
            </li>
          );
        })}
      </ul>

      <ConfirmDialog
        open={!!confirming}
        title="Delete this interview?"
        message={
          confirming && (
            <>
              <strong>
                {confirming.targetRole}
                {confirming.techStack && ` · ${confirming.techStack}`}
              </strong>{" "}
              from {formatDateTime(confirming.createdAt)} and its report will be permanently deleted. This
              can&rsquo;t be undone.
            </>
          )
        }
        loading={!!confirming && deletingId === confirming.id}
        onConfirm={() => confirming && dispatch(deleteInterviewRequest(confirming.id))}
        onCancel={() => setPicked(null)}
      />
    </>
  );
};

export default InterviewList;

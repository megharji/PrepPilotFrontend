import { Link } from "react-router-dom";
import { FiChevronRight, FiClock, FiMessageSquare } from "react-icons/fi";
import type { InterviewRecord } from "../../types/interview.types";
import { formatDateTime, formatDuration } from "../../utils/interviewStats";
import { DIFFICULTIES, INTERVIEW_TYPES, labelOf } from "../../data/interviewSetup";

const scoreTone = (score: number) => (score >= 7 ? "is-good" : score >= 4 ? "is-mid" : "is-low");

interface InterviewListProps {
  interviews: InterviewRecord[];
  emptyText: string;
}

// Dashboard (recent) aur History (sab) dono me same list
const InterviewList = ({ interviews, emptyText }: InterviewListProps) => {
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
    <ul className="interview-list">
      {interviews.map((item) => (
        <li key={item.id}>
          <Link to={`/history/${item.id}`} className="interview-row">
            <span className={`score-pill ${scoreTone(item.report.overall)}`}>{item.report.overall}/10</span>
            <span className="interview-row__main">
              <strong>
                {item.roleTitle}
                {item.config && (
                  <span className="interview-row__tag">
                    {labelOf(INTERVIEW_TYPES, item.config.type)} ·{" "}
                    {labelOf(DIFFICULTIES, item.config.difficulty)}
                  </span>
                )}
              </strong>
              <span className="interview-row__meta">
                {formatDateTime(item.createdAt)}
                <span>
                  <FiMessageSquare /> {item.report.turns.length} answers
                </span>
                <span>
                  <FiClock /> {formatDuration(item.durationSec)}
                </span>
              </span>
            </span>
            <FiChevronRight className="interview-row__chev" aria-hidden="true" />
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default InterviewList;

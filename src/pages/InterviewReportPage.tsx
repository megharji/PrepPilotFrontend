import { Link, useNavigate, useParams } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import DemoReportView from "./demo/DemoReportView";
import { useAppSelector } from "../redux/hooks";
import { selectInterviewById } from "../redux/selector";
import { formatDateTime } from "../utils/interviewStats";
import ConfigSummary from "../components/interview-setup/ConfigSummary";

// History me se ek interview ka poora report
const InterviewReportPage = () => {
  const { id = "" } = useParams();
  const navigate = useNavigate();
  const interview = useAppSelector((state) => selectInterviewById(state, id));

  if (!interview) {
    return (
      <div className="container page">
        <div className="empty">
          <p>This interview could not be found.</p>
          <Link to="/history" className="btn btn--outline btn--sm">
            Back to history
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="container report-back">
        <Link to="/history" className="text-link">
          <FiArrowLeft /> All interviews
        </Link>
        <span className="muted">{formatDateTime(interview.createdAt)}</span>
      </div>
      {interview.config && (
        <div className="container report-config">
          <ConfigSummary config={interview.config} />
        </div>
      )}
      <DemoReportView
        report={interview.report}
        roleTitle={interview.roleTitle}
        isAuthenticated
        label="Interview report"
        onRetry={() => navigate("/interview")}
      />
    </>
  );
};

export default InterviewReportPage;

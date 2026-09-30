import { Link } from "react-router-dom";
import { FiPlus } from "react-icons/fi";
import { useAppSelector } from "../redux/hooks";
import { selectMyInterviews } from "../redux/selector";
import InterviewList from "../components/dashboard/InterviewList";

const HistoryPage = () => {
  const interviews = useAppSelector(selectMyInterviews);

  return (
    <div className="container page">
      <header className="page__head page__head--row">
        <div>
          <h1>Interview History</h1>
          <p>
            {interviews.length
              ? `${interviews.length} interview${interviews.length > 1 ? "s" : ""} so far. Open one to see the full report.`
              : "Every interview you complete will show up here."}
          </p>
        </div>
        {interviews.length > 0 && (
          <Link to="/interview" className="btn btn--primary">
            <FiPlus /> New interview
          </Link>
        )}
      </header>

      <InterviewList interviews={interviews} emptyText="No interviews yet. Start your first interview!" />
    </div>
  );
};

export default HistoryPage;

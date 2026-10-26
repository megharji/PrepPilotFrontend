import { useEffect } from "react";
import { Link } from "react-router-dom";
import { FiPlus } from "react-icons/fi";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { selectInterviewList, selectLocalReportsByServerId } from "../redux/selector";
import { getInterviewsRequest } from "../redux/reducers/Interview/interviewListReducer";
import InterviewList from "../components/dashboard/InterviewList";

const HistoryPage = () => {
  const dispatch = useAppDispatch();
  const { items: interviews, loading, loaded } = useAppSelector(selectInterviewList);
  const reports = useAppSelector(selectLocalReportsByServerId);

  // GET /api/interviews
  useEffect(() => {
    dispatch(getInterviewsRequest());
  }, [dispatch]);

  const count = interviews.length;

  return (
    <div className="container page">
      <header className="page__head page__head--row">
        <div>
          <h1>Interview History</h1>
          <p>
            {!loaded
              ? "Loading your interviews…"
              : count
                ? `${count} interview${count > 1 ? "s" : ""} so far. Open one to see its details.`
                : "Every interview you start will show up here."}
          </p>
        </div>
        {count > 0 && (
          <Link to="/interview" className="btn btn--primary">
            <FiPlus /> New interview
          </Link>
        )}
      </header>

      <InterviewList
        interviews={interviews}
        reports={reports}
        loading={loading}
        emptyText="No interviews yet. Start your first interview!"
      />
    </div>
  );
};

export default HistoryPage;

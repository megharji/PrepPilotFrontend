import { Link } from "react-router-dom";
import { useAppSelector } from "../redux/hooks";
import { selectCurrentUser, selectMyInterviews } from "../redux/selector";
import { getInterviewStats } from "../utils/interviewStats";
import StartInterviewCard from "../components/dashboard/StartInterviewCard";
import ProgressStats from "../components/dashboard/ProgressStats";
import InterviewList from "../components/dashboard/InterviewList";

const RECENT_LIMIT = 3;

const DashboardPage = () => {
  const user = useAppSelector(selectCurrentUser);
  const interviews = useAppSelector(selectMyInterviews);

  const firstName = user?.name.split(" ")[0] ?? "there";
  const stats = getInterviewStats(interviews);

  return (
    <div className="container page">
      <header className="page__head">
        <h1>Welcome, {firstName} 👋</h1>
        <p>Ready to practice your next interview?</p>
      </header>

      <StartInterviewCard />

      <ProgressStats stats={stats} />

      <section>
        <div className="app-section-head">
          <h2 className="app-section-title">Recent Interviews</h2>
          {interviews.length > RECENT_LIMIT && (
            <Link to="/history" className="text-link">
              View all
            </Link>
          )}
        </div>
        <InterviewList
          interviews={interviews.slice(0, RECENT_LIMIT)}
          emptyText="No interviews yet. Start your first interview!"
        />
      </section>
    </div>
  );
};

export default DashboardPage;

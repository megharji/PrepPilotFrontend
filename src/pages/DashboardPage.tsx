import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { selectCurrentUser, selectInterviewList, selectLocalReportsByServerId } from "../redux/selector";
import { getInterviewsRequest } from "../redux/reducers/Interview/interviewListReducer";
import { getInterviewStats } from "../utils/interviewStats";
import { countByType, lastSevenDays } from "../utils/dashboardData";
import DashboardHero from "../components/dashboard/DashboardHero";
import ProgressStats from "../components/dashboard/ProgressStats";
import InterviewList from "../components/dashboard/InterviewList";
import ActivityChart from "../components/dashboard/ActivityChart";
import TypeBreakdown from "../components/dashboard/TypeBreakdown";
import type { InterviewRecord } from "../types/interview.types";

const RECENT_LIMIT = 5;

const DashboardPage = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectCurrentUser);
  const { items: interviews, loading } = useAppSelector(selectInterviewList);
  const reports = useAppSelector(selectLocalReportsByServerId);

  // GET /api/interviews
  useEffect(() => {
    dispatch(getInterviewsRequest());
  }, [dispatch]);

  const firstName = user?.name.split(" ")[0] ?? "there";

  // Sirf poore hue interviews gine jaate hain: report bani ho ya backend status COMPLETED.
  // Setup karke chhod diye (Not started) list me dikhte hain, par stats/charts me nahi.
  const completed = interviews.filter((i) => reports.has(i.id) || i.status === "COMPLETED");
  const notStarted = interviews.length - completed.length;

  // Average score: server ka AI score pehle (har device pe), warna is browser ki report
  const scores = completed
    .map((i) => i.overallScore ?? reports.get(i.id)?.report.overall)
    .filter((s): s is number => typeof s === "number");
  const avgScore = scores.length
    ? Math.round((scores.reduce((sum, s) => sum + s, 0) / scores.length) * 10) / 10
    : null;
  // Strongest skill ke liye har skill ka score chahiye, wo sirf is browser ki reports me hai
  const localReports = completed.map((i) => reports.get(i.id)).filter((r): r is InterviewRecord => !!r);
  const { strongestSkill } = getInterviewStats(localReports);
  const days = lastSevenDays(completed);
  const thisWeek = days.reduce((sum, d) => sum + d.count, 0);

  return (
    <div className="container page page--wide">
      <DashboardHero firstName={firstName} total={completed.length} thisWeek={thisWeek} />

      <ProgressStats
        total={completed.length}
        notStarted={notStarted}
        thisWeek={thisWeek}
        avgScore={avgScore}
        strongestSkill={strongestSkill}
        reportsCount={scores.length}
      />

      <div className="dash-cols">
        <section>
          <div className="app-section-head">
            <h2 className="app-section-title">Recent Interviews</h2>
            {interviews.length > RECENT_LIMIT && (
              <Link to="/history" className="text-link">
                View all ({interviews.length})
              </Link>
            )}
          </div>
          <InterviewList
            interviews={interviews.slice(0, RECENT_LIMIT)}
            reports={reports}
            loading={loading}
            emptyText="No interviews yet. Start your first interview!"
          />
        </section>

        <aside className="dash-side">
          <ActivityChart days={days} />
          <TypeBreakdown types={countByType(completed)} />
        </aside>
      </div>
    </div>
  );
};

export default DashboardPage;

import { Link } from "react-router-dom";
import { FiArrowRight, FiCpu } from "react-icons/fi";
import { greetingFor } from "../../utils/dashboardData";

interface DashboardHeroProps {
  firstName: string;
  total: number;
  thisWeek: number;
}

const summaryLine = (total: number, thisWeek: number) => {
  if (!total) return "Your first mock interview takes about 10 minutes. Ready when you are.";
  if (thisWeek)
    return `${thisWeek} interview${thisWeek > 1 ? "s" : ""} completed this week. Keep the momentum going.`;
  return "No practice this week yet. A short session today keeps you sharp.";
};

// Greeting + summary + Start Interview, ek hi banner me
const DashboardHero = ({ firstName, total, thisWeek }: DashboardHeroProps) => (
  <section className="dash-hero">
    <div className="dash-hero__copy">
      <span className="dash-hero__eyebrow">{greetingFor()}</span>
      <h1>{firstName} 👋</h1>
      <p>{summaryLine(total, thisWeek)}</p>
    </div>
    <div className="dash-hero__cta">
      <span className="dash-hero__icon" aria-hidden="true">
        <FiCpu />
      </span>
      <div>
        <strong>Start a New AI Interview</strong>
        <span>Role, experience, JD or resume: you choose.</span>
      </div>
      <Link to="/interview" className="btn btn--light">
        Start Interview <FiArrowRight />
      </Link>
    </div>
  </section>
);

export default DashboardHero;

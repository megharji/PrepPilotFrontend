import type { ReactNode } from "react";
import { FiAward, FiBarChart2, FiCalendar, FiLayers } from "react-icons/fi";

interface StatCardProps {
  icon: ReactNode;
  label: string;
  value: string;
  hint: string;
}

const StatCard = ({ icon, label, value, hint }: StatCardProps) => (
  <div className="stat">
    <span className="stat__icon" aria-hidden="true">
      {icon}
    </span>
    <span className="stat__label">{label}</span>
    <strong className="stat__value">{value}</strong>
    <span className="stat__hint">{hint}</span>
  </div>
);

interface ProgressStatsProps {
  // Sirf poore hue interviews
  total: number;
  // Setup kiye par shuru nahi kiye
  notStarted: number;
  thisWeek: number;
  avgScore: number | null;
  strongestSkill: string | null;
  // Kitne interviews ki report is device pe hai (score unhi se)
  reportsCount: number;
}

const ProgressStats = ({
  total,
  notStarted,
  thisWeek,
  avgScore,
  strongestSkill,
  reportsCount,
}: ProgressStatsProps) => (
  <section>
    <h2 className="app-section-title">Your Progress</h2>
    <div className="stats">
      <StatCard
        icon={<FiLayers />}
        label="Completed"
        value={String(total)}
        hint={notStarted ? `${notStarted} not started` : "All time"}
      />
      <StatCard
        icon={<FiCalendar />}
        label="This week"
        value={String(thisWeek)}
        hint="Completed, last 7 days"
      />
      <StatCard
        icon={<FiBarChart2 />}
        label="Avg Score"
        value={avgScore === null ? "--" : `${avgScore}/10`}
        hint={
          reportsCount
            ? `From ${reportsCount} report${reportsCount > 1 ? "s" : ""}`
            : "Finish an interview to see"
        }
      />
      <StatCard
        icon={<FiAward />}
        label="Strongest Skill"
        value={strongestSkill ?? "--"}
        hint={strongestSkill ? "Highest average" : "Appears after a report"}
      />
    </div>
  </section>
);

export default ProgressStats;

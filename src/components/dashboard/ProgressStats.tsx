import type { ReactNode } from "react";
import { FiAward, FiBarChart2, FiLayers } from "react-icons/fi";
import type { InterviewStats } from "../../utils/interviewStats";

interface StatCardProps {
  icon: ReactNode;
  label: string;
  value: string;
}

const StatCard = ({ icon, label, value }: StatCardProps) => (
  <div className="stat">
    <span className="stat__icon" aria-hidden="true">
      {icon}
    </span>
    <span className="stat__label">{label}</span>
    <strong className="stat__value">{value}</strong>
  </div>
);

const ProgressStats = ({ stats }: { stats: InterviewStats }) => (
  <section>
    <h2 className="app-section-title">Your Progress</h2>
    <div className="stats">
      <StatCard icon={<FiLayers />} label="Interviews" value={String(stats.total)} />
      <StatCard
        icon={<FiBarChart2 />}
        label="Avg Score"
        value={stats.avgScore === null ? "--" : `${stats.avgScore}/10`}
      />
      <StatCard icon={<FiAward />} label="Strongest Skill" value={stats.strongestSkill ?? "--"} />
    </div>
  </section>
);

export default ProgressStats;

import type { DayCount } from "../../utils/dashboardData";

// Last 7 days: har din ke interviews. Ek hi series (brand rang), isliye legend nahi; title naam batata hai.
const ActivityChart = ({ days }: { days: DayCount[] }) => {
  const max = Math.max(1, ...days.map((d) => d.count));
  const total = days.reduce((sum, d) => sum + d.count, 0);

  return (
    <section className="panel">
      <div className="panel__head">
        <h2 className="app-section-title">Last 7 days</h2>
        <span className="muted">{total} completed</span>
      </div>

      <div className="bars" role="img" aria-label={days.map((d) => `${d.fullLabel}: ${d.count}`).join(", ")}>
        {days.map((d) => (
          <div key={d.key} className={`bars__col ${d.isToday ? "is-today" : ""}`}>
            {/* Hover target poora column, sirf bar nahi */}
            <div className="bars__track" data-tip={`${d.fullLabel}: ${d.count} completed`}>
              {d.count > 0 && <span className="bars__value">{d.count}</span>}
              <span
                className={`bars__bar ${d.count ? "" : "is-zero"}`}
                style={{ height: d.count ? `${(d.count / max) * 100}%` : undefined }}
              />
            </div>
            <span className="bars__label">{d.isToday ? "Today" : d.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ActivityChart;

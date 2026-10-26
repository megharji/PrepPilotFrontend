import type { TypeCount } from "../../utils/dashboardData";

// Interview types: kis round ki kitni practice. Ek hi rang (magnitude), label aur ginti text rang me.
const TypeBreakdown = ({ types }: { types: TypeCount[] }) => {
  const max = Math.max(1, ...types.map((t) => t.count));

  return (
    <section className="panel">
      <div className="panel__head">
        <h2 className="app-section-title">Interview types</h2>
      </div>
      <ul className="hbars">
        {types.map((t) => (
          <li key={t.id} className="hbars__row" data-tip={`${t.label}: ${t.count}`}>
            <span className="hbars__label">{t.label}</span>
            <span className="hbars__track">
              {t.count > 0 && <span className="hbars__bar" style={{ width: `${(t.count / max) * 100}%` }} />}
            </span>
            <span className="hbars__value">{t.count}</span>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default TypeBreakdown;

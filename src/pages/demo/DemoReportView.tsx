import type { CSSProperties } from "react";
import { Link } from "react-router-dom";
import { FiArrowRight, FiCheck, FiInfo, FiRotateCcw, FiX } from "react-icons/fi";
import type { DemoReport } from "../../utils/demoScoring";

interface DemoReportViewProps {
  report: DemoReport;
  roleTitle: string;
  isAuthenticated: boolean;
  onRetry: () => void;
  label?: string;
}

const verdict = (score: number) => {
  if (score >= 8) return "Interview-ready. Keep it sharp.";
  if (score >= 6) return "Solid base, a few gaps to close.";
  if (score >= 4) return "Getting there. Focus on the missed points.";
  return "Early days. Practice will move this fast.";
};

const DemoReportView = ({
  report,
  roleTitle,
  isAuthenticated,
  onRetry,
  label = "Your demo report",
}: DemoReportViewProps) => (
  <div className="report-page container">
    <section className="report-hero">
      <div
        className="score-ring"
        style={{ "--value": report.overall * 10 } as CSSProperties}
        aria-label={`Overall score ${report.overall} out of 10`}
      >
        <strong>{report.overall}</strong>
        <span>/10</span>
      </div>
      <div className="report-hero__copy">
        <span className="eyebrow">
          {label} · {roleTitle}
        </span>
        <h1>{verdict(report.overall)}</h1>
        <div className="report__bars">
          {report.skills.map((s) => (
            <div key={s.label} className="bar">
              <div className="bar__row">
                <span>{s.label}</span>
                <span>{s.score}/10</span>
              </div>
              <div className="bar__track">
                <span style={{ width: `${s.score * 10}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>

    <p className="notice">
      <FiInfo />
      Scores are based on which key points your answers covered. The full AI interviewer, which understands
      your answers in depth, is on the way.
    </p>

    <section className="answers">
      <h2>Answer by answer</h2>
      {report.turns.map((t, i) => (
        <article key={i} className="answer-card">
          <header className="answer-card__head">
            <div>
              <span className="answer-card__topic">
                {t.topic}
                {t.isFollowUp && " · Follow-up"}
              </span>
              <h3>{t.turn.question}</h3>
            </div>
            <span className={`score-pill ${t.score >= 7 ? "is-good" : t.score >= 4 ? "is-mid" : "is-low"}`}>
              {t.skipped ? "Skipped" : `${t.score}/10`}
            </span>
          </header>

          {!t.skipped && <blockquote className="answer-card__answer">{t.answer}</blockquote>}

          <ul className="points">
            {t.covered.map((kp) => (
              <li key={kp.label} className="points__hit">
                <FiCheck /> {kp.label}
              </li>
            ))}
            {t.missed.map((kp) => (
              <li key={kp.label} className="points__miss">
                <FiX /> {kp.label}
              </li>
            ))}
          </ul>

          <details className="ideal">
            <summary>What a strong answer includes</summary>
            <p>{t.turn.ideal}</p>
          </details>
        </article>
      ))}
    </section>

    <section className="report-cta">
      {isAuthenticated ? (
        <>
          <div>
            <h2>Nice work. Keep the streak going.</h2>
            <p>Try another role, or head back to your dashboard.</p>
          </div>
          <div className="report-cta__actions">
            <button type="button" className="btn btn--outline btn--lg" onClick={onRetry}>
              <FiRotateCcw /> Try another role
            </button>
            <Link to="/dashboard" className="btn btn--primary btn--lg">
              Go to dashboard <FiArrowRight />
            </Link>
          </div>
        </>
      ) : (
        <>
          <div>
            <h2>Want to keep practising?</h2>
            <p>
              Create a free account to save your progress and get the full AI interviewer as it rolls out.
            </p>
          </div>
          <div className="report-cta__actions">
            <button type="button" className="btn btn--outline btn--lg" onClick={onRetry}>
              <FiRotateCcw /> Try another role
            </button>
            <Link to="/register" className="btn btn--primary btn--lg">
              Create free account <FiArrowRight />
            </Link>
          </div>
        </>
      )}
    </section>
  </div>
);

export default DemoReportView;

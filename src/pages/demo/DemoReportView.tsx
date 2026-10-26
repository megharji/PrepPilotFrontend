import { useState } from "react";
import type { CSSProperties } from "react";
import { Link } from "react-router-dom";
import {
  FiArrowRight,
  FiCheck,
  FiChevronDown,
  FiInfo,
  FiRotateCcw,
  FiStar,
  FiTarget,
  FiTrendingUp,
  FiX,
} from "react-icons/fi";
import type { DemoReport, TurnResult } from "../../utils/demoScoring";

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

const scoreTone = (score: number) => (score >= 7 ? "is-good" : score >= 4 ? "is-mid" : "is-low");

interface AnswerCardProps {
  t: TurnResult;
  number: number;
  open: boolean;
  onToggle: () => void;
}

// Ek jawab: tumne kya kaha, score, kya achha / kya sudhaaro, aur behtar jawab.
// Band ho to sirf sawaal + score (kam scroll); header click se khulta hai.
const AnswerCard = ({ t, number, open, onToggle }: AnswerCardProps) => {
  const bodyId = `answer-${number}`;
  const hasCoaching = !!(t.strengths?.length || t.improvements?.length);
  // AI ka behtar version (tumhare jawab se bana); na ho (skip / quick scoring) to sawaal ka model answer
  const better = t.betterAnswer || t.turn.ideal;

  return (
    <article className={`answer-card ${open ? "is-open" : ""}`}>
      <button
        type="button"
        className="answer-card__head answer-card__toggle"
        onClick={onToggle}
        aria-expanded={open}
        aria-controls={bodyId}
      >
        <div>
          <span className="answer-card__topic">
            Q{number} · {t.topic}
            {t.isFollowUp && " · Follow-up"}
          </span>
          <h3>{t.turn.question}</h3>
        </div>
        <span className="answer-card__side">
          <span className={`score-pill ${t.skipped ? "is-low" : scoreTone(t.score)}`}>
            {t.skipped ? "Skipped" : `${t.score}/10`}
          </span>
          <FiChevronDown className="answer-card__chev" aria-hidden="true" />
        </span>
      </button>

      {open && (
        <div id={bodyId} className="answer-card__body">
          <span className="answer-card__label">Your answer</span>
          {t.skipped ? (
            <p className="answer-card__answer answer-card__answer--empty">You skipped this question.</p>
          ) : (
            <blockquote className="answer-card__answer">{t.answer}</blockquote>
          )}

          {t.feedback && <p className="answer-card__feedback">{t.feedback}</p>}

          {hasCoaching && (
            <div className="coach">
              {!!t.strengths?.length && (
                <div className="coach__col coach__col--good">
                  <span className="coach__title">
                    <FiCheck /> What went well
                  </span>
                  <ul>
                    {t.strengths.map((s) => (
                      <li key={s}>{s}</li>
                    ))}
                  </ul>
                </div>
              )}
              {!!t.improvements?.length && (
                <div className="coach__col coach__col--fix">
                  <span className="coach__title">
                    <FiTrendingUp /> How to improve
                  </span>
                  <ul>
                    {t.improvements.map((s) => (
                      <li key={s}>{s}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {better && (
            <div className="better-answer">
              <span className="better-answer__title">
                <FiStar /> {t.betterAnswer ? "A better way to answer" : "How to answer this"}
              </span>
              <p>{better}</p>
            </div>
          )}

          <span className="answer-card__label">Key points</span>
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

          {/* Behtar jawab upar dikh gaya ho to model answer yahan, compare karne ke liye */}
          {t.betterAnswer && t.turn.ideal && (
            <details className="ideal">
              <summary>Model answer</summary>
              <p>{t.turn.ideal}</p>
            </details>
          )}
        </div>
      )}
    </article>
  );
};

const DemoReportView = ({
  report,
  roleTitle,
  isAuthenticated,
  onRetry,
  label = "Your demo report",
}: DemoReportViewProps) => {
  const isAi = report.turns.some((t) => t.feedback);
  // Kaunse answer cards khule hain (shuru me sab band, kam scroll)
  const [openCards, setOpenCards] = useState<Set<number>>(() => new Set());
  const allOpen = openCards.size === report.turns.length;
  const toggleCard = (i: number) =>
    setOpenCards((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  const answeredCount = report.turns.filter((t) => !t.skipped).length;

  return (
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
          <p className="muted">
            {answeredCount} of {report.turns.length} answered
          </p>
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

      {/* AI ka poore interview pe nichod */}
      {report.summary && (
        <section className="report-summary">
          <h2>Summary</h2>
          <p>{report.summary}</p>
          <div className="coach">
            {!!report.strengths?.length && (
              <div className="coach__col coach__col--good">
                <span className="coach__title">
                  <FiCheck /> Your strengths
                </span>
                <ul>
                  {report.strengths.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ul>
              </div>
            )}
            {!!report.focusAreas?.length && (
              <div className="coach__col coach__col--fix">
                <span className="coach__title">
                  <FiTarget /> Focus next
                </span>
                <ul>
                  {report.focusAreas.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </section>
      )}

      <p className="notice">
        <FiInfo />
        {isAi
          ? "Scored by AI against the key points of each question. Each answer below shows what went well, what to improve, and a better way to say it."
          : "Quick scoring: based on which key points your answers mentioned. AI scoring checks the meaning of your answers in depth."}
      </p>

      <section className="answers">
        <div className="answers__head">
          <h2>Answer by answer</h2>
          <button
            type="button"
            className="text-link answers__toggle-all"
            onClick={() => setOpenCards(allOpen ? new Set() : new Set(report.turns.map((_, i) => i)))}
          >
            {allOpen ? "Collapse all" : "Expand all"}
          </button>
        </div>
        {report.turns.map((t, i) => (
          <AnswerCard key={i} t={t} number={i + 1} open={openCards.has(i)} onToggle={() => toggleCard(i)} />
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
};

export default DemoReportView;

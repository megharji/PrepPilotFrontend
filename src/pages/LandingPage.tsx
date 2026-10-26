import type { CSSProperties } from "react";
import { Link } from "react-router-dom";
import {
  FiArrowRight,
  FiBarChart2,
  FiCheck,
  FiClock,
  FiCode,
  FiCpu,
  FiFileText,
  FiMessageSquare,
  FiMic,
  FiRepeat,
  FiSliders,
  FiX,
} from "react-icons/fi";
import Logo from "../components/Logo";
import ThemeToggle from "../components/ThemeToggle";
import { useAppSelector } from "../redux/hooks";
import { selectIsAuthenticated } from "../redux/selector";
import { TOPICS } from "../data/topics";
import { useReveal } from "../hooks/useReveal";

const steps = [
  {
    icon: <FiSliders />,
    title: "Set up your interview",
    text: "Pick the role, experience level and round: DSA, system design, frontend, backend or HR.",
  },
  {
    icon: <FiMic />,
    title: "Face the AI interviewer",
    text: "It asks one question at a time, listens to your answer and digs deeper with follow-ups, like a real panel.",
  },
  {
    icon: <FiBarChart2 />,
    title: "Get a detailed report",
    text: "See where you were strong, where you slipped, and what a stronger answer would have sounded like.",
  },
];

const features = [
  {
    icon: <FiRepeat />,
    title: "Follow-ups based on your answer",
    text: "Mention Redis and it will ask about eviction. Say O(n log n) and it will ask why. No fixed script.",
  },
  {
    icon: <FiMic />,
    title: "Speak or type",
    text: "Answer out loud to practise communication, or type when you want to think through details.",
  },
  {
    icon: <FiCode />,
    title: "Live coding round",
    text: "Solve problems in a built-in editor while the interviewer asks about complexity and edge cases.",
  },
  {
    icon: <FiClock />,
    title: "Real time pressure",
    text: "Timed rounds with the same pace as an actual interview, so the real one feels familiar.",
  },
  {
    icon: <FiFileText />,
    title: "Questions from your resume",
    text: "Upload your resume and get grilled on your own projects, just like interviewers do.",
  },
  {
    icon: <FiCpu />,
    title: "Role and level aware",
    text: "A fresher and a senior engineer get very different questions. So will you.",
  },
];

const reportScores = [
  { label: "Problem solving", score: 8 },
  { label: "Communication", score: 6 },
  { label: "Technical depth", score: 7 },
  { label: "Code quality", score: 9 },
];

const comparison = [
  {
    alone: "Reading answers and feeling ready",
    withUs: "Saying the answer out loud, under a timer",
  },
  {
    alone: "Nobody asks “why?” after you answer",
    withUs: "Follow-up questions that test real understanding",
  },
  {
    alone: "No idea how you actually performed",
    withUs: "Scored feedback on every answer you give",
  },
  {
    alone: "Same question lists everyone has seen",
    withUs: "Questions tailored to your role, level and resume",
  },
];

const faqs = [
  {
    q: "How is this different from a question bank?",
    a: "A question bank shows you questions. PrepPilot interviews you: it asks, waits for your answer, reacts to what you said and follows up. You practise the conversation, not just the content.",
  },
  {
    q: "Do I need to speak, or can I type?",
    a: "Both work. Speaking is closer to a real interview and helps with communication. Typing is useful when you are learning a new topic.",
  },
  {
    q: "Which roles and rounds are covered?",
    a: "Software engineering roles across frontend, backend and full stack, with DSA, system design, JavaScript, React, Node.js and behavioral (HR) rounds.",
  },
  {
    q: "Is it free?",
    a: "Creating an account is free. Sign up to get access as the AI interview rounds roll out.",
  },
];

const LandingPage = () => {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  useReveal();

  return (
    <div className="landing">
      <nav className="nav container">
        <Logo />
        <div className="nav__links">
          <a href="#how">How it works</a>
          <a href="#features">Features</a>
          <a href="#faq">FAQ</a>
        </div>
        <div className="nav__actions">
          <ThemeToggle />
          {isAuthenticated ? (
            <Link to="/dashboard" className="btn btn--primary">
              Dashboard <FiArrowRight />
            </Link>
          ) : (
            <>
              <Link to="/login" className="btn btn--ghost">
                Log in
              </Link>
              <Link to="/register" className="btn btn--primary">
                Sign up
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* ---------- Hero ---------- */}
      <header className="hero container">
        <div className="hero__copy">
          <span className="pill">
            <FiCpu /> AI-powered mock interviews
          </span>
          <h1>
            Practise with an AI interviewer that feels like the <em>real thing</em>.
          </h1>
          <p className="hero__lead">
            PrepPilot interviews you the way real companies do. It asks questions, listens to your answers,
            pushes back with follow-ups and tells you exactly what to improve.
          </p>
          <div className="hero__cta">
            <Link to="/demo" className="btn btn--primary btn--lg">
              Take a mock interview <FiArrowRight />
            </Link>
            <a href="#how" className="link-arrow">
              See how it works
            </a>
          </div>
          <p className="hero__note">Free demo. No sign-up needed.</p>
          <ul className="hero__points">
            <li>
              <FiCheck /> Adaptive follow-up questions
            </li>
            <li>
              <FiCheck /> Voice or text answers
            </li>
            <li>
              <FiCheck /> Instant feedback report
            </li>
          </ul>
        </div>

        <div className="hero__visual">
          <div className="room" aria-label="Preview of an AI mock interview">
            <div className="room__bar">
              <span className="room__live">
                <span className="room__dot" /> Live interview
              </span>
              <span className="room__meta">Frontend Developer · Round 2 of 4</span>
              <span className="room__timer">18:42</span>
            </div>

            <div className="room__chat">
              <div className="msg msg--ai">
                <span className="msg__who">
                  <FiCpu /> Interviewer
                </span>
                <p>
                  You mentioned wrapping the list in useMemo. When could useMemo actually make things slower?
                </p>
              </div>

              <div className="msg msg--me">
                <span className="msg__who">You</span>
                <div className="wave" aria-hidden="true">
                  {Array.from({ length: 22 }).map((_, i) => (
                    <span key={i} style={{ animationDelay: `${(i % 7) * 0.12}s` }} />
                  ))}
                </div>
                <span className="msg__status">
                  <FiMic /> Listening…
                </span>
              </div>
            </div>

            <div className="room__feedback">
              <span className="room__fb-title">Live notes</span>
              <div className="room__chips">
                <span className="chip chip--good">Clear structure</span>
                <span className="chip chip--warn">Give a concrete example</span>
                <span className="chip chip--info">Mention memo cost</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ---------- How it works ---------- */}
      <section id="how" className="section container">
        <div className="section__head" data-reveal>
          <span className="eyebrow">How it works</span>
          <h2>From nervous to interview-ready in three steps</h2>
          <p>No scheduling, no waiting for a friend to be free. Start an interview whenever you want.</p>
        </div>
        <ol className="steps">
          {steps.map((step, i) => (
            <li
              key={step.title}
              className="step"

              data-reveal
              style={{ "--delay": `${i * 90}ms` } as CSSProperties}
            >
              <span className="step__icon">{step.icon}</span>
              <span className="step__num">0{i + 1}</span>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* ---------- Features ---------- */}
      <section id="features" className="section container">
        <div className="section__head" data-reveal>
          <span className="eyebrow">Why it feels real</span>
          <h2>Built to behave like an actual interviewer</h2>
        </div>
        <div className="feature-grid">
          {features.map((f, i) => (
            <article
              key={f.title}
              className="feature"

              data-reveal
              style={{ "--delay": `${(i % 3) * 90}ms` } as CSSProperties}
            >
              <span className="feature__icon">{f.icon}</span>
              <h3>{f.title}</h3>
              <p>{f.text}</p>
            </article>
          ))}
        </div>
      </section>

      {/* ---------- Report ---------- */}
      <section className="section container">
        <div className="report-split" data-reveal>
          <div>
            <span className="eyebrow">After every interview</span>
            <h2>Feedback that tells you what to fix</h2>
            <p className="report-split__lead">
              &ldquo;Good job&rdquo; does not help anyone. After each round you get scores for the skills
              interviewers actually judge, with notes tied to your own answers.
            </p>
            <ul className="checklist">
              <li>
                <FiCheck /> Score for each skill, not just pass/fail
              </li>
              <li>
                <FiCheck /> What you said vs. what a strong answer includes
              </li>
              <li>
                <FiCheck /> Topics to revise before your next attempt
              </li>
            </ul>
          </div>

          <div className="report" aria-label="Example feedback report">
            <div className="report__head">
              <div>
                <span className="report__label">Example report</span>
                <h3>Backend Developer · DSA round</h3>
              </div>
              <div className="report__overall">
                <strong>7.5</strong>
                <span>/10</span>
              </div>
            </div>

            <div className="report__bars">
              {reportScores.map((s) => (
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

            <div className="report__note report__note--good">
              <strong>Strong</strong> Explained the two-pointer approach before writing code.
            </div>
            <div className="report__note report__note--warn">
              <strong>Improve</strong> Missed the empty-input edge case until the interviewer asked.
            </div>
          </div>
        </div>
      </section>

      {/* ---------- Rounds ---------- */}
      <section className="section container">
        <div className="section__head" data-reveal>
          <span className="eyebrow">Interview rounds</span>
          <h2>Every round of a tech interview loop</h2>
        </div>
        <div className="topic-grid">
          {TOPICS.map((topic, i) => (
            <article
              key={topic.id}
              className={`topic topic--${topic.tone}`}

              data-reveal
              style={{ "--delay": `${(i % 3) * 90}ms` } as CSSProperties}
            >
              <span className="topic__dot" />
              <h3>{topic.title}</h3>
              <p>{topic.description}</p>
              <p className="topic__sample">
                <FiMessageSquare /> &ldquo;{topic.sample}&rdquo;
              </p>
            </article>
          ))}
        </div>
      </section>

      {/* ---------- Comparison ---------- */}
      <section className="section container">
        <div className="section__head section__head--center" data-reveal>
          <span className="eyebrow">The difference</span>
          <h2>Reading answers is not the same as giving them</h2>
        </div>
        <div className="compare" data-reveal>
          <div className="compare__col compare__col--alone">
            <h3>Preparing alone</h3>
            <ul>
              {comparison.map((c) => (
                <li key={c.alone}>
                  <FiX /> {c.alone}
                </li>
              ))}
            </ul>
          </div>
          <div className="compare__col compare__col--us">
            <h3>With PrepPilot</h3>
            <ul>
              {comparison.map((c) => (
                <li key={c.withUs}>
                  <FiCheck /> {c.withUs}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ---------- FAQ ---------- */}
      <section id="faq" className="section container">
        <div className="section__head section__head--center" data-reveal>
          <span className="eyebrow">FAQ</span>
          <h2>Questions, answered</h2>
        </div>
        <div className="faq" data-reveal>
          {faqs.map((item) => (
            <details key={item.q} className="faq__item">
              <summary>{item.q}</summary>
              <p>{item.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* ---------- Final CTA ---------- */}
      {!isAuthenticated && (
        <section className="container">
          <div className="cta-band" data-reveal>
            <div>
              <h2>Your next interview should not be your first practice.</h2>
              <p>Try a free mock interview right now. No account needed.</p>
            </div>
            <Link to="/demo" className="btn btn--light btn--lg">
              Try the demo interview <FiArrowRight />
            </Link>
          </div>
        </section>
      )}

      <footer className="footer container">
        <Logo />
        <span>© {new Date().getFullYear()} PrepPilot. AI mock interviews for software engineers.</span>
      </footer>
    </div>
  );
};

export default LandingPage;

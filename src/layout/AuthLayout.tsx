import type { ReactNode } from "react";
import { FiCheck } from "react-icons/fi";
import Logo from "../components/Logo";

interface AuthLayoutProps {
  title: string;
  subtitle: string;
  children: ReactNode;
}

const highlights = [
  "An AI interviewer that asks follow-ups based on your answers",
  "DSA, system design, frontend, backend and HR rounds",
  "A scored feedback report after every mock interview",
];

const AuthLayout = ({ title, subtitle, children }: AuthLayoutProps) => (
  <div className="auth">
    <aside className="auth__showcase">
      <Logo light />

      <div className="auth__pitch">
        <h2>
          Walk into your next interview <em>prepared</em>, not nervous.
        </h2>
        <ul className="auth__list">
          {highlights.map((item) => (
            <li key={item}>
              <span className="auth__tick">
                <FiCheck />
              </span>
              {item}
            </li>
          ))}
        </ul>
      </div>

      <figure className="auth__quote">
        <div className="auth__qcard">
          <span className="auth__qtag">AI Interviewer · Follow-up</span>
          <p>&ldquo;You said you&rsquo;d add a cache. What happens when that cache goes down?&rdquo;</p>
        </div>
        <figcaption>The kind of follow-up you&rsquo;ll learn to handle.</figcaption>
      </figure>
    </aside>

    <main className="auth__panel">
      <div className="auth__mobile-logo">
        <Logo />
      </div>
      <div className="auth__card">
        <header className="auth__header">
          <h1>{title}</h1>
          <p>{subtitle}</p>
        </header>
        {children}
      </div>
    </main>
  </div>
);

export default AuthLayout;

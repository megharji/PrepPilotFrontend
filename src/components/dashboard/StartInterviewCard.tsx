import { Link } from "react-router-dom";
import { FiArrowRight, FiCpu } from "react-icons/fi";

const StartInterviewCard = () => (
  <section className="start-card">
    <div className="start-card__icon" aria-hidden="true">
      <FiCpu />
    </div>
    <div className="start-card__body">
      <h2>Start a New AI Interview</h2>
      <p>Pick a role, answer like it&rsquo;s the real thing, and get a scored report at the end.</p>
    </div>
    <Link to="/interview" className="btn btn--primary btn--lg">
      Start Interview <FiArrowRight />
    </Link>
  </section>
);

export default StartInterviewCard;

import { Link } from "react-router-dom";

interface LogoProps {
  to?: string;
  light?: boolean;
}

const Logo = ({ to = "/", light = false }: LogoProps) => (
  <Link to={to} className={`logo ${light ? "logo--light" : ""}`}>
    {/* Wahi icon jo browser tab (favicon) me hai */}
    <img src="/favicon.svg" alt="" className="logo__mark" width={34} height={34} />
    <span className="logo__text">
      Prep<span>Pilot</span>
    </span>
  </Link>
);

export default Logo;

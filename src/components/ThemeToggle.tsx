import { useState } from "react";
import { FiMoon, FiSun } from "react-icons/fi";

type Theme = "light" | "dark";

// index.html ki inline script bhi yahi key padhti hai (pehle paint se pehle theme lagane ke liye)
const STORAGE_KEY = "preppilot-theme";

const currentTheme = (): Theme =>
  document.documentElement.dataset.theme === "light" ? "light" : "dark";

// Header ka ☀️/🌙 button. Default dark; choice browser me yaad rehti hai.
const ThemeToggle = () => {
  const [theme, setTheme] = useState<Theme>(currentTheme);

  const toggle = () => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // private mode / storage band: is session ke liye theme phir bhi badal jaata hai
    }
    setTheme(next);
  };

  const label = theme === "dark" ? "Switch to light theme" : "Switch to dark theme";

  return (
    <button type="button" className="icon-btn theme-toggle" onClick={toggle} aria-label={label} title={label}>
      {theme === "dark" ? <FiSun /> : <FiMoon />}
    </button>
  );
};

export default ThemeToggle;

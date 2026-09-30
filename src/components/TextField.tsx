import { useState } from "react";
import type { InputHTMLAttributes, ReactNode } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: ReactNode;
  error?: string;
}

const TextField = ({ label, icon, error, type = "text", id, ...rest }: TextFieldProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const inputId = id ?? rest.name;

  return (
    <div className={`field ${error ? "field--error" : ""}`}>
      <label htmlFor={inputId} className="field__label">
        {label}
      </label>
      <div className="field__control">
        {icon && <span className="field__icon">{icon}</span>}
        <input
          id={inputId}
          type={isPassword && showPassword ? "text" : type}
          className="field__input"
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : undefined}
          {...rest}
        />
        {isPassword && (
          <button
            type="button"
            className="field__toggle"
            onClick={() => setShowPassword((v) => !v)}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <FiEyeOff /> : <FiEye />}
          </button>
        )}
      </div>
      {error && (
        <p id={`${inputId}-error`} className="field__error">
          {error}
        </p>
      )}
    </div>
  );
};

export default TextField;

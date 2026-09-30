import type { ReactNode } from "react";
import { FiAlertCircle, FiCheckCircle } from "react-icons/fi";

interface AlertProps {
  variant: "error" | "success";
  children: ReactNode;
}

const Alert = ({ variant, children }: AlertProps) => (
  <div className={`alert alert--${variant}`} role={variant === "error" ? "alert" : "status"}>
    {variant === "error" ? <FiAlertCircle /> : <FiCheckCircle />}
    <span>{children}</span>
  </div>
);

export default Alert;

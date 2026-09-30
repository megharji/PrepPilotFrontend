import { useEffect } from "react";
import { FiAlertCircle, FiCheckCircle, FiInfo, FiX } from "react-icons/fi";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { selectSnackbars } from "../redux/selector";
import { hideSnackbar } from "../redux/reducers/Snackbar/snackbarReducer";
import type { SnackbarItem } from "../redux/reducers/Snackbar/snackbarReducer";

// Error thoda zyada der dikhe, taaki padh sakein
const DURATION = { success: 3500, info: 4500, error: 6000 };

const ICON = {
  success: <FiCheckCircle />,
  error: <FiAlertCircle />,
  info: <FiInfo />,
};

const SnackbarToast = ({ item }: { item: SnackbarItem }) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const timer = window.setTimeout(() => dispatch(hideSnackbar(item.id)), DURATION[item.type]);
    return () => window.clearTimeout(timer);
  }, [dispatch, item.id, item.type]);

  return (
    <div className={`snackbar snackbar--${item.type}`} role={item.type === "error" ? "alert" : "status"}>
      <span className="snackbar__icon">{ICON[item.type]}</span>
      <p className="snackbar__msg">{item.message}</p>
      <button
        type="button"
        className="snackbar__close"
        onClick={() => dispatch(hideSnackbar(item.id))}
        aria-label="Dismiss"
      >
        <FiX />
      </button>
    </div>
  );
};

// App me ek hi baar render hota hai (App.tsx)
const Snackbar = () => {
  const items = useAppSelector(selectSnackbars);
  if (!items.length) return null;

  return (
    <div className="snackbar-stack" aria-live="polite">
      {items.map((item) => (
        <SnackbarToast key={item.id} item={item} />
      ))}
    </div>
  );
};

export default Snackbar;

import { useEffect, useRef } from "react";
import type { ReactNode } from "react";
import { FiAlertTriangle } from "react-icons/fi";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: ReactNode;
  confirmLabel?: string;
  // Request chal rahi ho to button pe spinner, dobara click nahi
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

// "Pakka?" wala popup (delete jaise kaam ke liye). Esc ya bahar click = Cancel.
const ConfirmDialog = ({
  open,
  title,
  message,
  confirmLabel = "Delete",
  loading = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) => {
  const cancelRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    // Galti se Enter dabe to delete na ho: focus Cancel pe
    cancelRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !loading) onCancel();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, loading, onCancel]);

  if (!open) return null;

  return (
    <div className="dialog-backdrop" onMouseDown={() => !loading && onCancel()}>
      <div
        className="dialog"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        aria-describedby="confirm-message"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <span className="dialog__icon" aria-hidden="true">
          <FiAlertTriangle />
        </span>
        <h2 id="confirm-title">{title}</h2>
        <div id="confirm-message" className="dialog__message">
          {message}
        </div>
        <div className="dialog__actions">
          <button
            ref={cancelRef}
            type="button"
            className="btn btn--outline"
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </button>
          <button type="button" className="btn btn--danger" onClick={onConfirm} disabled={loading}>
            {loading ? (
              <>
                <span className="spinner" aria-hidden="true" /> Deleting…
              </>
            ) : (
              confirmLabel
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;

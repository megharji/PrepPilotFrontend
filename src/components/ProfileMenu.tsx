import { useEffect, useRef, useState } from "react";
import { FiCalendar, FiChevronDown, FiLogOut, FiMail } from "react-icons/fi";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { selectCurrentUser } from "../redux/selector";
import { logout } from "../redux/reducers/Auth/loginReducer";
import { showSnackbar } from "../redux/reducers/Snackbar/snackbarReducer";

const getInitials = (name?: string) =>
  name
    ?.split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("") || "?";

const formatJoined = (value?: string) =>
  value ? new Date(value).toLocaleDateString(undefined, { month: "short", year: "numeric" }) : "";

const ProfileMenu = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectCurrentUser);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Bahar click ya Escape pe band
  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div className="profile-menu" ref={ref}>
      <button
        type="button"
        className="profile-menu__trigger"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <span className="avatar" aria-hidden="true">
          {getInitials(user?.name)}
        </span>
        <FiChevronDown className={`profile-menu__chev ${open ? "is-open" : ""}`} />
        <span className="sr-only">Open profile menu</span>
      </button>

      {open && (
        <div className="profile-menu__panel" role="menu">
          <div className="profile-menu__head">
            <span className="avatar avatar--md" aria-hidden="true">
              {getInitials(user?.name)}
            </span>
            <div>
              <strong>{user?.name}</strong>
              <span className="profile-menu__email">
                <FiMail /> {user?.email}
              </span>
            </div>
          </div>
          {user?.createdAt && (
            <p className="profile-menu__meta">
              <FiCalendar /> Member since {formatJoined(user.createdAt)}
            </p>
          )}
          <button
            type="button"
            role="menuitem"
            className="profile-menu__item profile-menu__item--danger"
            onClick={() => {
              dispatch(logout());
              dispatch(showSnackbar({ type: "info", message: "You have been logged out." }));
            }}
          >
            <FiLogOut /> Log out
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfileMenu;

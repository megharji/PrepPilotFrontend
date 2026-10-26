import { useEffect } from "react";
import { NavLink, Outlet } from "react-router-dom";
import Logo from "../components/Logo";
import ProfileMenu from "../components/ProfileMenu";
import ThemeToggle from "../components/ThemeToggle";
import { useAppDispatch } from "../redux/hooks";
import { profileRequest } from "../redux/reducers/User/profileReducer";

const navClass = ({ isActive }: { isActive: boolean }) => `app-nav__link ${isActive ? "is-active" : ""}`;

// Login ke baad wale saare pages ka common header
const AppLayout = () => {
  const dispatch = useAppDispatch();

  // App khulte hi GET /api/users/profile: user taaza ho jaata hai,
  // aur token expire ho chuka ho to 401 aake logout ho jaata hai
  useEffect(() => {
    dispatch(profileRequest());
  }, [dispatch]);

  return (
    <div className="app">
      <header className="app-header">
        <div className="container app-header__inner">
          <Logo to="/dashboard" />
          <nav className="app-nav" aria-label="Main">
            <NavLink to="/dashboard" className={navClass}>
              Dashboard
            </NavLink>
            <NavLink to="/history" className={navClass}>
              History
            </NavLink>
          </nav>
          <ThemeToggle />
          <ProfileMenu />
        </div>
      </header>

      <main className="app-main">
        <Outlet />
      </main>
    </div>
  );
};

export default AppLayout;

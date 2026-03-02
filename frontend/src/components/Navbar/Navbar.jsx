import { useEffect, useState } from "react";
import { IoMenu } from "react-icons/io5";
import { RxCross2 } from "react-icons/rx";
import { Link, useLocation } from "react-router-dom";
import { syncActivities } from "../../api/athlete";
import useAuth from "../../hooks/useAuth";
import "./nav.css";

const Navbar = () => {
  const [profileOpen, setProfileOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuPinned, setMenuPinned] = useState(false);
  const isMobile = window.matchMedia("(hover: none)").matches;
  const location = useLocation();
  const { user, logout } = useAuth();

  const [active, setActive] = useState(location.pathname);

  useEffect(() => {
    const close = () => {
      setProfileOpen(false);
      setMenuOpen(false);
      setMenuPinned(false);
    };

    window.addEventListener("click", close);
    return () => window.removeEventListener("click", close);
  }, []);

  return (
    <nav className="nav-container">
      <div className="nav-profile-brand-container">
        <div
          className="nav-profile-container"
          onClick={(e) => {
            e.stopPropagation();
          }}
          onMouseEnter={() => !isMobile && setProfileOpen(true)}
          onMouseLeave={() => !isMobile && setProfileOpen(false)}
        >
          <img
            src={user?.profile}
            alt="Athlete Profile Picture"
            className="profile-img"
          />

          {profileOpen && (
            <div
              className="profile-dropdown"
              onClick={(e) => e.stopPropagation()}
            >
              <button onClick={() => syncActivities()} className="profile-btn">
                Sync Activities
              </button>
              <button onClick={() => logout()} className="profile-btn">
                Logout
              </button>
            </div>
          )}
        </div>

        <h1>LetMeRun</h1>
      </div>
      <div
        className="menu-container"
        onMouseEnter={() => !isMobile && setMenuOpen(true)}
        onMouseLeave={() => !isMobile && !menuPinned && setMenuOpen(false)}
        onClick={(e) => {
          e.stopPropagation();
          isMobile ? setMenuOpen(!menuOpen) : setMenuPinned(!menuPinned);
        }}
      >
        {menuOpen && menuPinned ? <RxCross2 /> : <IoMenu />}

        {(menuOpen || menuPinned) && (
          <div className="tab-dropdown" onClick={(e) => e.stopPropagation()}>
            <Link
              to="/dashboard"
              className={
                active === "/dashboard" ? "tab-link active-link" : "tab-link"
              }
              onClick={() => setActive("/dashboard")}
            >
              Dashboard
            </Link>
            <Link
              to="/history"
              className={
                active === "/history" ? "tab-link active-link" : "tab-link"
              }
              onClick={() => setActive("/history")}
            >
              History
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

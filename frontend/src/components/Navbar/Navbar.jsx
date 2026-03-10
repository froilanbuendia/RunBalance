import { useEffect, useState } from "react";
import { IoMenu } from "react-icons/io5";
import { RxCross2 } from "react-icons/rx";
import { Link, useLocation } from "react-router-dom";
import { syncActivities } from "../../api/athlete";
import useAuth from "../../hooks/useAuth";
import { useSync } from "../../context/SyncContext";
import "./nav.css";

const Navbar = () => {
  const [profileOpen, setProfileOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuPinned, setMenuPinned] = useState(false);
  const isMobile = window.matchMedia("(hover: none)").matches;
  const [syncing, setSyncing] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();
  const { triggerSync } = useSync();

  const isActive = (path) => location.pathname === path;
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
              <button
                onClick={async () => {
                  setSyncing(true);
                  await syncActivities();
                  triggerSync();
                  setSyncing(false);
                }}
                className="profile-btn"
              >
                {syncing ? "Syncing..." : "Sync Activities"}
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
                isActive("/dashboard") ? "tab-link active-link" : "tab-link"
              }
            >
              Dashboard
            </Link>
            <Link
              to="/history"
              className={
                isActive("/history") ? "tab-link active-link" : "tab-link"
              }
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

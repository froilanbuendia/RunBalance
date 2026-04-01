import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { IoMenu } from "react-icons/io5";
import { RxCross2 } from "react-icons/rx";
import { FaArrowsRotate } from "react-icons/fa6";
import { Link, useLocation } from "react-router-dom";
import { syncActivities } from "../../api/athlete";
import useAuth from "../../hooks/useAuth";
import { useSync } from "../../context/SyncContext";
import ChatDrawer from "../Chat/ChatDrawer";
import "./nav.css";
import "../Chat/chat.css";

const MotionDiv = motion.div;

const Navbar = () => {
  const [profileOpen, setProfileOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();
  const { triggerSync } = useSync();

  const isActive = (path) => location.pathname === path;

  useEffect(() => {
    const close = () => {
      setProfileOpen(false);
      setMenuOpen(false);
    };
    window.addEventListener("click", close);
    return () => window.removeEventListener("click", close);
  }, []);

  const handleSync = async (e) => {
    e.stopPropagation();
    setSyncing(true);
    await syncActivities();
    triggerSync();
    setSyncing(false);
  };

  if (!user) return null;

  return (
    <>
    <nav className="nav-wrapper">
      <div className="nav-container">
        {/* Brand */}
        <Link to="/dashboard" className="nav-brand">
          LetMeRun
        </Link>

        {/* Desktop nav links */}
        {user && (
          <div className="nav-links">
            <Link
              to="/dashboard"
              className={`nav-link${isActive("/dashboard") ? " active-link" : ""}`}
            >
              Dashboard
            </Link>
            <Link
              to="/history"
              className={`nav-link${isActive("/history") ? " active-link" : ""}`}
            >
              History
            </Link>
          </div>
        )}

        {/* Right side */}
        {user && (
          <div className="nav-actions">
            {/* Sync button */}
            <button
              className={`sync-btn${syncing ? " syncing" : ""}`}
              onClick={handleSync}
              disabled={syncing}
              title="Sync activities from Strava"
            >
              <FaArrowsRotate className={syncing ? "spin" : ""} />
              <span className="sync-label">
                {syncing ? "Syncing…" : "Sync"}
              </span>
            </button>

            {/* Avatar + dropdown */}
            <div
              className="nav-profile"
              onClick={(e) => {
                e.stopPropagation();
                setProfileOpen((o) => !o);
              }}
            >
              <img src={user.profile} alt="Profile" className="profile-img" />
              <AnimatePresence>
                {profileOpen && (
                  <MotionDiv
                    className="profile-dropdown"
                    onClick={(e) => e.stopPropagation()}
                    initial={{ opacity: 0, y: -6, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -6, scale: 0.97 }}
                    transition={{ duration: 0.15, ease: "easeOut" }}
                  >
                    <span className="profile-name">
                      {user.firstname} {user.lastname}
                    </span>
                    <hr className="profile-divider" />
                    <button onClick={logout} className="profile-btn">
                      Log out
                    </button>
                  </MotionDiv>
                )}
              </AnimatePresence>
            </div>

            {/* Mobile hamburger */}
            <button
              className="nav-hamburger"
              onClick={(e) => {
                e.stopPropagation();
                setMenuOpen((o) => !o);
              }}
              aria-label="Toggle menu"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={menuOpen ? "close" : "open"}
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  style={{ display: "flex" }}
                >
                  {menuOpen ? <RxCross2 /> : <IoMenu />}
                </motion.span>
              </AnimatePresence>
            </button>
          </div>
        )}
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {user && menuOpen && (
          <MotionDiv
            className="nav-drawer"
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            style={{ overflow: "hidden" }}
          >
            <Link
              to="/dashboard"
              className={`drawer-link${isActive("/dashboard") ? " active-link" : ""}`}
              onClick={() => setMenuOpen(false)}
            >
              Dashboard
            </Link>
            <Link
              to="/history"
              className={`drawer-link${isActive("/history") ? " active-link" : ""}`}
              onClick={() => setMenuOpen(false)}
            >
              History
            </Link>
          </MotionDiv>
        )}
      </AnimatePresence>
    </nav>

      {/* Floating coach button */}
      <button
        className="chat-fab"
        onClick={() => setChatOpen(true)}
        aria-label="Open coach"
      >
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7H3a7 7 0 0 1 7-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 0 1 2-2M7.5 13A1.5 1.5 0 0 0 6 14.5 1.5 1.5 0 0 0 7.5 16 1.5 1.5 0 0 0 9 14.5 1.5 1.5 0 0 0 7.5 13m9 0A1.5 1.5 0 0 0 15 14.5 1.5 1.5 0 0 0 16.5 16 1.5 1.5 0 0 0 18 14.5 1.5 1.5 0 0 0 16.5 13M5 18v1a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-1H5z" />
        </svg>
      </button>

      <ChatDrawer open={chatOpen} onClose={() => setChatOpen(false)} />
    </>
  );
};

export default Navbar;

import { useEffect, useState } from "react";
import { IoMenu } from "react-icons/io5";
import { RxCross2 } from "react-icons/rx";
import { Link, useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import "./nav.css";

const Navbar = () => {
  const [athlete, setAthlete] = useState(null);
  const [profileOpen, setProfileOpen] = useState(false);
  // const [profilePinned, setProfilePinned] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuPinned, setMenuPinned] = useState(false);
  const location = useLocation();

  const [active, setActive] = useState(location.pathname);

  const token = localStorage.getItem("jwt");
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("jwt");
    navigate("/");
  };

  const handleSyncActivities = async () => {
    try {
      const res = await fetch("http://localhost:4000/api/activities/sync", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // send JWT
        },
        body: JSON.stringify({}), // empty body if backend fetches Strava activities itself
      });

      const data = await res.json();

      if (!res.ok) {
        console.error("Backend error:", data);
        alert("Failed to sync activities.");
        return;
      }

      console.log("Activities synced:", data);
      alert(`Successfully synced ${data.count} activities!`);
    } catch (err) {
      console.error("Fetch error:", err);
      alert("Failed to sync activities.");
    }
  };

  const getAthlete = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/athlete/profile`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!res.ok) throw new Error("Failed to retrieve dashboard.");

      const athleteData = await res.json();
      setAthlete(athleteData);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  useEffect(() => {
    if (token) getAthlete();
  }, [token]);

  useEffect(() => {
    setIsMobile(window.matchMedia("(hover: none)").matches);
  }, []);

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
            src={athlete?.profile}
            alt="Athlete Profile Picture"
            className="profile-img"
          />

          {profileOpen && (
            <div
              className="profile-dropdown"
              onClick={(e) => e.stopPropagation()}
            >
              <button onClick={handleSyncActivities} className="profile-btn">
                Sync Activities
              </button>
              <button onClick={handleLogout} className="profile-btn">
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

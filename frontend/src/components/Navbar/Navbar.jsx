import { useEffect, useState } from "react";
import { IoMenu } from "react-icons/io5";
import { IoMdArrowDropdown } from "react-icons/io";
import { RxCross2 } from "react-icons/rx";

import "./nav.css";

const Navbar = () => {
  const [athlete, setAthlete] = useState(null);
  const [menuModal, setMenuModal] = useState(false);
  const [profileModal, setProfileModal] = useState(false);
  const token = localStorage.getItem("jwt");

  const handleLogout = () => {
    localStorage.removeItem("jwt");
    window.location.reload(); // or use navigate("/")
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

  const isMobile = window.matchMedia("(hover: none)").matches;

  return (
    <nav className="nav-container">
      <div className="nav-profile-brand-container">
        <div
          className="nav-profile-container"
          onMouseEnter={() => !isMobile && setProfileModal(true)}
          onMouseLeave={() => !isMobile && setProfileModal(false)}
          onClick={() => isMobile && setProfileModal(!profileModal)}
        >
          <img
            src={`${athlete?.profile}`}
            alt="Athlete Profile Picture"
            className="profile-img"
          />
          {profileModal && (
            <div className="profile-dropdown">
              <button
                onClick={() => handleSyncActivities()}
                className="profile-btn"
              >
                Sync Activities
              </button>
              <button onClick={() => handleLogout()} className="profile-btn">
                Logout
              </button>
            </div>
          )}
        </div>
        <h1>LetMeRun</h1>
      </div>
      {menuModal ? (
        <RxCross2 onClick={() => setMenuModal(!menuModal)} />
      ) : (
        <IoMenu onClick={() => setMenuModal(!menuModal)} />
      )}
    </nav>
  );
};

export default Navbar;

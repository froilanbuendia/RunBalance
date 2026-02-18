import { useEffect, useState } from "react";
import { IoMenu } from "react-icons/io5";
import { RxCross2 } from "react-icons/rx";

import "./nav.css";

const Navbar = () => {
  const [athlete, setAthlete] = useState(null);
  const [menu, setMenu] = useState(false);
  const token = localStorage.getItem("jwt");

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

  console.log(athlete);

  return (
    <nav className="nav-container">
      <div className="nav-profile">
        <img
          src={`${athlete?.profile}`}
          alt="Athlete Profile Picture"
          className="profile-img"
        />
        <h1>LetMeRun</h1>
      </div>
      {menu ? (
        <RxCross2 onClick={() => setMenu(!menu)} />
      ) : (
        <IoMenu onClick={() => setMenu(!menu)} />
      )}
    </nav>
  );
};

export default Navbar;

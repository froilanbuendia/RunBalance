import React from "react";

const Dashboard = () => {
  const token = localStorage.getItem("jwt");

  const handleLogout = () => {
    localStorage.removeItem("jwt");
    window.location.href = "/";
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

  if (!token) return <div>Not logged in.</div>;

  return (
    <div>
      <h1>Welcome!</h1>
      <p>You are logged in.</p>
      <button onClick={handleLogout}>Logout</button>
      <button onClick={handleSyncActivities}>Sync Activities</button>
    </div>
  );
};

export default Dashboard;

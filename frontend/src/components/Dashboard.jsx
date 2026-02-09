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
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({}), // backend uses athleteId from token
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

  const getDashboard = async () => {
    try {
      const res = await fetch("http://localhost:4000/api/metrics/performance", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();

      if (!res.ok) {
        console.error("Backend error:", data);
        alert("Failed to retrieve dashboard.");
        return;
      }

      console.log("Activities synced:", data);
      alert(`Successfully retrieved ${data.count}!`);
    } catch (err) {
      console.error("Fetch error:", err);
      alert("Failed to retrieve data.");
    }
  };

  const getInjuryRisk = async () => {
    try {
      const res = await fetch("http://localhost:4000/api/metrics/injury", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();

      if (!res.ok) {
        console.error("Backend error:", data);
        alert("Failed to retrieve dashboard.");
        return;
      }

      console.log("Activities synced:", data);
      alert(`Successfully retrieved ${data.count}!`);
    } catch (err) {
      console.error("Fetch error:", err);
      alert("Failed to retrieve data.");
    }
  };

  if (!token) return <div>Not logged in.</div>;

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
      <h1>Welcome!</h1>
      <p>You are logged in.</p>
      <button
        onClick={handleLogout}
        style={{ margin: "5px", padding: "10px 15px" }}
      >
        Logout
      </button>
      <button
        onClick={handleSyncActivities}
        style={{ margin: "5px", padding: "10px 15px" }}
      >
        Sync Activities
      </button>

      <button
        onClick={getDashboard}
        style={{ margin: "5px", padding: "10px 15px" }}
      >
        Get Dashboard
      </button>
      <button
        onClick={getInjuryRisk}
        style={{ margin: "5px", padding: "10px 15px" }}
      >
        Get Injury Risk
      </button>
    </div>
  );
};

export default Dashboard;

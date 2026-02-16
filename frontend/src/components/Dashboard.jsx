import { useEffect, useState } from "react";
import MileageCard from "./cards/MileageCard";
import InjuryRiskCard from "./cards/InjuryRiskCard";
import MileageChart from "./charts/MileageChart";
import PaceTrendChart from "./charts/PaceTrendChart";

export default function Dashboard() {
  const [data, setData] = useState(null);
  const token = localStorage.getItem("jwt");

  const getOverview = async () => {
    try {
      const res = await fetch("http://localhost:4000/api/metrics/overview", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error("Failed to retrieve dashboard.");
      }
      const overviewData = await res.json();
      setData(overviewData);
    } catch (err) {
      console.error("Fetch error:", err);
      throw new Error("Fetch error:", err);
    }
  };

  useEffect(() => {
    if (token) {
      getOverview();
    }
  }, [token]);

  if (!data) return <p>Loading...</p>;

  console.log(data);

  return (
    <div style={{ padding: 16 }}>
      <MileageCard miles={data.weeklyDistance.miles} />
      <InjuryRiskCard risk={data.injuryRisk} />
      <MileageChart weeklyMileage={data.rollingMileageAvg} />
      <PaceTrendChart paceData={data.paceTrend} />
    </div>
  );
}

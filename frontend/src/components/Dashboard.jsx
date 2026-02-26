import { useEffect, useState } from "react";
import MileageCard from "./Cards/MileageCard";
import InjuryRiskCard from "./Cards/InjuryRiskCard";
import MileageChart from "./Charts/MileageChart";
import PaceTrendChart from "./Charts/PaceTrendChart";
import Chart from "./Cards/Chart";
import { fetchDashboardData } from "../api/athlete";

export default function Dashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchOverview = async () => {
      try {
        const dashboardData = await fetchDashboardData();
        setData(dashboardData);
      } catch (err) {
        throw new Error(`Getting Dashboard Error: ${err}`);
      }
    };
    fetchOverview();
  }, []);

  if (!data) return <p>Loading...</p>;

  console.log(data);

  return (
    <div style={{ padding: 16 }}>
      <MileageCard miles={data.weeklyDistance.miles} />
      <InjuryRiskCard risk={data.injuryRisk} />
      <Chart chart={<MileageChart weeklyMileage={data.rollingMileageAvg} />} />
      <Chart chart={<PaceTrendChart paceData={data.paceTrend} />} />
    </div>
  );
}

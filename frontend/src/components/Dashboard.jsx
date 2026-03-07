import MileageCard from "./Cards/MileageCard";
import InjuryRiskCard from "./Cards/InjuryRiskCard";
import MileageChart from "./Charts/MileageChart";
import PaceTrendChart from "./Charts/PaceTrendChart";
import Chart from "./Cards/Chart";
import useDashboardData from "../hooks/useDashboardData";

const Dashboard = () => {
  const { data, loading } = useDashboardData();
  if (loading) return <p>Loading...</p>;

  return (
    <div style={{ padding: 16 }}>
      <MileageCard miles={data.rolling_7d_miles} />
      <InjuryRiskCard risk={data.acwr} />
      <Chart chart={<MileageChart weeklyMileage={data.mileage} />} />
      <Chart chart={<PaceTrendChart paceData={data.paceTrend} />} />
    </div>
  );
};

export default Dashboard;

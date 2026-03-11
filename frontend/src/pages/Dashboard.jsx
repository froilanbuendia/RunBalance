import MileageCard from "../components/Cards/MileageCard";
import InjuryRiskCard from "../components/Cards/InjuryRiskCard";
import MileageChart from "../components/Charts/MileageChart";
import PaceTrendChart from "../components/Charts/PaceTrendChart";
import Chart from "../components/Cards/Chart";
import useDashboardData from "../hooks/useDashboardData";
import { fetchMileage, fetchPaceTrend } from "../api/athlete";
import { useState } from "react";
import useChartData from "../hooks/useChartData";
import "./pages.css";
import "./dashboard.css";

const Dashboard = () => {
  const { data, loading } = useDashboardData();
  const [mileageRange, setMileageRange] = useState("1m");
  const [paceRange, setPaceRange] = useState("1m");
  const mileage = useChartData(mileageRange, fetchMileage);
  const pace = useChartData(paceRange, fetchPaceTrend);
  const handleMileageRange = (range) => {
    setMileageRange(range);
  };

  const handlePaceRange = (range) => {
    setPaceRange(range);
  };
  if (loading) return <p>Loading...</p>;

  return (
    <div className="page-container">
      <div className="card-container">
        <MileageCard
          miles={data.miles}
          diff={data.diff}
          duration={data.duration}
          runs={data.runs}
          target={data.weeklyGoal.target_distance}
          completed={data.weeklyGoal.completed_distance}
        />
        <InjuryRiskCard risk={data.acwr} />
      </div>
      <div className="card-container">
        <Chart
          name="Mileage"
          handleRange={handleMileageRange}
          range={mileageRange}
          chart={<MileageChart weeklyMileage={mileage} />}
        />
        <Chart
          name="Pace"
          handleRange={handlePaceRange}
          range={paceRange}
          chart={<PaceTrendChart paceData={pace} />}
        />
      </div>
    </div>
  );
};

export default Dashboard;

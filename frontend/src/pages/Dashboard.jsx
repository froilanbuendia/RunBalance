import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Tooltip } from "react-tooltip";
import MileageCard from "../components/Cards/MileageCard";
import InjuryRiskCard from "../components/Cards/InjuryRiskCard";
import MileageChart from "../components/Charts/MileageChart";
import PaceTrendChart from "../components/Charts/PaceTrendChart";
import TrainingHeatmap from "../components/Charts/TrainingHeatMap";
import Chart from "../components/Cards/Chart";
import useDashboardData from "../hooks/useDashboardData";
import useChartData from "../hooks/useChartData";
import { fetchHeatmapData, fetchMileage, fetchPaceTrend } from "../api/athlete";
import "./pages.css";
import "./dashboard.css";

const MotionDiv = motion.div;

const useCountUp = (target, duration = 1100) => {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!target) return;
    const start = performance.now();
    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(eased * target);
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [target, duration]);
  return value;
};

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09 } },
};

const row = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

const cardHover = { y: -3, transition: { duration: 0.18 } };

const formatPrTime = (seconds) => {
  if (!seconds) return "—";
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.round(seconds % 60);
  if (h > 0)
    return `${h}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  return `${m}:${s.toString().padStart(2, "0")}`;
};

const KpiStrip = ({ prs }) => {
  const mileVal     = useCountUp(prs?.mile);
  const fiveKVal    = useCountUp(prs?.fiveK);
  const tenKVal     = useCountUp(prs?.tenK);
  const halfVal     = useCountUp(prs?.half);
  const marathonVal = useCountUp(prs?.marathon);

  return (
    <div className="kpi-strip">
      <div className="kpi-item">
        <span className="kpi-value">{formatPrTime(mileVal)}</span>
        <span className="kpi-label">1 Mile PR</span>
      </div>
      <div className="kpi-item">
        <span className="kpi-value">{formatPrTime(fiveKVal)}</span>
        <span className="kpi-label">5K PR</span>
      </div>
      <div className="kpi-item">
        <span className="kpi-value">{formatPrTime(tenKVal)}</span>
        <span className="kpi-label">10K PR</span>
      </div>
      <div className="kpi-item">
        <span className="kpi-value">{formatPrTime(halfVal)}</span>
        <span className="kpi-label">Half PR</span>
      </div>
      <div className="kpi-item">
        <span className="kpi-value">{formatPrTime(marathonVal)}</span>
        <span className="kpi-label">Marathon PR</span>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const { data, loading, refresh } = useDashboardData();
  const [mileageRange, setMileageRange] = useState("1m");
  const [paceRange, setPaceRange] = useState("1m");
  const [heatmap, setHeatMap] = useState("distance");

  const mileage = useChartData(mileageRange, fetchMileage);
  const pace = useChartData(paceRange, fetchPaceTrend);
  const heatmapData = useChartData(heatmap, fetchHeatmapData);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="page-container">
      <MotionDiv
        className="dashboard-grid"
        variants={container}
        initial="hidden"
        animate="show"
      >
        <MotionDiv variants={row} className="dashboard-kpi">
          <KpiStrip prs={data.prs} />
        </MotionDiv>

        <MotionDiv variants={row} className="dashboard-cards-row">
          <MotionDiv whileHover={cardHover} className="dashboard-mileage">
            <MileageCard
              miles={data.miles}
              diff={data.diff}
              duration={data.duration}
              runs={data.runs}
              target={data.weeklyGoal.target_distance}
              completed={data.weeklyGoal.completed_distance}
              paceAvg={data.paceAvg}
              streak={data.streak}
              chronicMiles={data.acwr?.chronicMiles}
              onGoalUpdate={refresh}
            />
          </MotionDiv>
          <MotionDiv whileHover={cardHover} className="dashboard-injury">
            <InjuryRiskCard risk={data.acwr} />
          </MotionDiv>
        </MotionDiv>

        <MotionDiv variants={row} className="dashboard-cards-row">
          <MotionDiv whileHover={cardHover} className="dashboard-mchart">
            <Chart
              name="Mileage"
              handleRange={setMileageRange}
              range={mileageRange}
              chart={<MileageChart weeklyMileage={mileage} />}
            />
          </MotionDiv>
          <MotionDiv whileHover={cardHover} className="dashboard-pchart">
            <Chart
              name="Pace Trend"
              handleRange={setPaceRange}
              range={paceRange}
              chart={<PaceTrendChart paceData={pace} />}
            />
          </MotionDiv>
        </MotionDiv>

        <MotionDiv variants={row} className="dashboard-cards-row">
          <MotionDiv whileHover={cardHover} className="dashboard-heatmap">
            <Chart
              name="Training Heatmap"
              heatmap={heatmap}
              handleHeatMap={setHeatMap}
              chart={<TrainingHeatmap heatmap={heatmap} runs={heatmapData} />}
            />
            <Tooltip id="heatmap-tooltip" />
          </MotionDiv>
        </MotionDiv>
      </MotionDiv>
    </div>
  );
};

export default Dashboard;
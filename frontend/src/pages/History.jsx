import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { AnimatePresence, motion } from "framer-motion";
import {
  FaPersonRunning,
  FaClock,
  FaArrowTrendUp,
  FaHeart,
} from "react-icons/fa6";
import useHistory from "../hooks/useHistory";
import { fetchRunStats } from "../api/athlete";
import "./pages.css";
import "./history.css";

const MotionDiv = motion.div;

const PAGE_SIZE = 20;

// ── Animation variants ──────────────────────────────────────────
const cardVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.04, duration: 0.15, ease: "easeOut" },
  }),
};

const weekVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.125, ease: "easeOut" },
  },
};

// ── Animated counter ────────────────────────────────────────────
const useCountUp = (target, duration = 1000) => {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!target) return;
    const start = performance.now();
    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      setValue(eased * target);
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [target, duration]);
  return value;
};

// ── Formatters ───────────────────────────────────────────────────
const formatDuration = (seconds) => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
};

const formatPace = (movingTime, miles) => {
  if (!miles || miles <= 0) return "—";
  const secsPerMile = movingTime / miles;
  const m = Math.floor(secsPerMile / 60);
  const s = Math.round(secsPerMile % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
};

const getPaceColor = (movingTime, miles) => {
  if (!miles || miles <= 0) return "";
  const secsPerMile = movingTime / miles;
  if (secsPerMile < 600) return "pace-fast";
  if (secsPerMile < 660) return "pace-moderate";
  return "pace-easy";
};

const formatElevation = (meters) => {
  if (meters == null) return "—";
  return `${Math.round(meters * 3.28084)} ft`;
};

const getWeekStart = (dateStr) => {
  const date = new Date(dateStr);
  const day = date.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  const monday = new Date(date);
  monday.setDate(date.getDate() + diff);
  monday.setHours(0, 0, 0, 0);
  return monday;
};

const formatWeekLabel = (monday) => {
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  const opts = { month: "short", day: "numeric" };
  return `${monday.toLocaleDateString("en-US", opts)} – ${sunday.toLocaleDateString("en-US", opts)}`;
};

const formatDate = (dateStr) =>
  new Date(dateStr).toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
  });

const formatTotalTime = (seconds) => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
};

// ── Stats bar ────────────────────────────────────────────────────
const StatsBar = () => {
  const [stats, setStats] = useState(null);
  const runs = useCountUp(stats?.totalRuns);
  const miles = useCountUp(stats?.totalMiles);

  useEffect(() => {
    fetchRunStats().then(setStats).catch(console.error);
  }, []);

  if (!stats) return null;

  return (
    <MotionDiv
      className="stats-bar"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <div className="stats-bar-item">
        <span className="stats-bar-value">{Math.round(runs)}</span>
        <span className="stats-bar-label">Total Runs</span>
      </div>
      <div className="stats-bar-divider" />
      <div className="stats-bar-item">
        <span className="stats-bar-value">{miles.toFixed(1)}</span>
        <span className="stats-bar-label">Total Miles</span>
      </div>
      <div className="stats-bar-divider" />
      <div className="stats-bar-item">
        <span className="stats-bar-value">
          {formatTotalTime(stats.totalSeconds)}
        </span>
        <span className="stats-bar-label">Total Time</span>
      </div>
    </MotionDiv>
  );
};

// ── Grouping ─────────────────────────────────────────────────────
const groupByWeek = (activities) => {
  const groups = new Map();
  let staggerIndex = 0;
  activities.forEach((a) => {
    const monday = getWeekStart(a.start_date);
    const key = monday.toISOString();
    if (!groups.has(key))
      groups.set(key, { weekStart: monday, activities: [], totalMiles: 0 });
    const group = groups.get(key);
    group.activities.push({ activity: a, index: staggerIndex++ });
    group.totalMiles += parseFloat(a.miles);
  });
  return Array.from(groups.values()).sort((a, b) => b.weekStart - a.weekStart);
};

// ── Run card ─────────────────────────────────────────────────────
const RunCard = ({ activity: a, index }) => {
  const miles = parseFloat(a.miles);
  const paceColor = getPaceColor(a.moving_time, miles);

  return (
    <MotionDiv
      className="run-card"
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      custom={index}
      layout
    >
      <div className="run-card-header">
        <div>
          <p className="run-card-date">{formatDate(a.start_date)}</p>
          <h3 className="run-card-name">{a.name}</h3>
        </div>
        <span className="run-card-distance">{miles.toFixed(2)} mi</span>
      </div>
      <div className="run-card-stats">
        <div className="run-stat">
          <FaClock className="run-stat-icon" />
          <span className="run-stat-value">
            {formatDuration(a.moving_time)}
          </span>
          <span className="run-stat-label">Duration</span>
        </div>
        <div className="run-stat">
          <FaPersonRunning className="run-stat-icon" />
          <span className={`run-stat-value ${paceColor}`}>
            {formatPace(a.moving_time, miles)}
          </span>
          <span className="run-stat-label">Pace /mi</span>
        </div>
        <div className="run-stat">
          <FaArrowTrendUp className="run-stat-icon" />
          <span className="run-stat-value">
            {formatElevation(a.total_elevation_gain)}
          </span>
          <span className="run-stat-label">Elevation</span>
        </div>
        <div className="run-stat">
          <FaHeart className="run-stat-icon" />
          <span className="run-stat-value">
            {a.average_heartrate ? `${Math.round(a.average_heartrate)}` : "—"}
          </span>
          <span className="run-stat-label">Avg BPM</span>
        </div>
      </div>
    </MotionDiv>
  );
};

// ── Page ─────────────────────────────────────────────────────────
const History = () => {
  const { activities, loading, loadMore, hasMore } = useHistory(
    PAGE_SIZE,
    "Run",
  );
  const weeks = groupByWeek(activities);
  const { ref: sentinelRef, inView } = useInView({ rootMargin: "200px" });

  useEffect(() => {
    if (inView && hasMore && !loading) loadMore();
  }, [inView, hasMore, loading, loadMore]);

  return (
    <div className="page-container history-page">
      <div className="history-layout">
        <aside className="history-sidebar">
          <h2 className="history-title">Run History</h2>
          <StatsBar />
        </aside>

        <main className="history-main">
        {loading && activities.length === 0 ? (
          <p className="history-empty">Loading...</p>
        ) : activities.length === 0 ? (
          <p className="history-empty">No runs found. Try syncing first.</p>
        ) : (
          <div className="run-feed">
            <AnimatePresence>
              {weeks.map((week) => (
                <MotionDiv
                  key={week.weekStart.toISOString()}
                  className="week-group"
                  variants={weekVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <div className="week-header">
                    <span className="week-label">
                      {formatWeekLabel(week.weekStart)}
                    </span>
                    <span className="week-total">
                      {week.totalMiles.toFixed(1)} mi
                    </span>
                  </div>
                  {week.activities.map(({ activity, index }) => (
                    <RunCard
                      key={activity.id}
                      activity={activity}
                      index={index}
                    />
                  ))}
                </MotionDiv>
              ))}
            </AnimatePresence>

            <div ref={sentinelRef} className="scroll-sentinel" />
            {loading && activities.length > 0 && (
              <p className="history-empty">Loading...</p>
            )}
          </div>
        )}
        </main>
      </div>
    </div>
  );
};

export default History;

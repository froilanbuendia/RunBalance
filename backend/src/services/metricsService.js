const {
  getRolling7DayLoad,
  getLastWeekLoad,
  getRolling7DayStats,
  getAveragePaceByMiles,
  getRollingMileage,
  getPaceTrend,
  getRollingWeeklyGoal,
  getHeatmapData,
} = require("../repositories/metricsRepo");

exports.getPerformanceMetrics = async (athleteId) => {
  const weekly = await getRolling7DayLoad(athleteId);
  const avgPace = await getAveragePaceByMiles(athleteId);

  return {
    weeklyDistance: weekly,
    avgPace: avgPace,
  };
};

exports.getTrainingLoad = async (athleteId) => {
  const [week, lastWeek, stats, weeklyGoal] = await Promise.all([
    getRolling7DayLoad(athleteId),
    getLastWeekLoad(athleteId),
    getRolling7DayStats(athleteId),
    getRollingWeeklyGoal(athleteId),
  ]);

  if (!weeklyGoal) {
    return {
      miles: Number(week.rolling_7d_miles ?? 0),
      diff: Number(week.rolling_7d_miles ?? 0) - Number(lastWeek.last_week_miles ?? 0),
      runs: Number(stats.runs ?? 0),
      duration: Number(stats.total_seconds ?? 0),
      weeklyGoal: { target_distance: 0, completed_distance: 0 },
    };
  }

  const diff = week.rolling_7d_miles - lastWeek.last_week_miles;
  return {
    miles: week.rolling_7d_miles,
    diff,
    runs: stats.runs,
    duration: stats.total_seconds,
    weeklyGoal: weeklyGoal,
  };
};

exports.getMileage = async (athleteId, weeks) => {
  return await getRollingMileage(athleteId, weeks);
};

exports.getPaceTrend = async (athleteId, weeks) => {
  return await getPaceTrend(athleteId, weeks);
};

exports.getAveragePace = async (athleteId) => {
  return await getAveragePaceByMiles(athleteId);
};

exports.getHeatmapData = async (athleteId, metric) => {
  return await getHeatmapData(athleteId, metric);
};

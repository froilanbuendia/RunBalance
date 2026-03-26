const {
  getRolling7DayLoad,
  getLastWeekLoad,
  getRolling7DayStats,
  getRollingFourWeekAverage,
  getAveragePaceByMiles,
  getRollingPaceTrend,
  getRollingMileage,
  getPaceTrend,
  getRollingWeeklyGoal,
  getHeatmapData,
} = require("../repositories/metricsRepo");

exports.getPerformanceMetrics = async (athleteId) => {
  const weekly = await getRolling7DayLoad(athleteId);
  const trend = await getRollingPaceTrend(athleteId);
  const rolling_4wk_avg = await getRollingFourWeekAverage(athleteId);
  const avgPace = await getAveragePaceByMiles(athleteId);

  return {
    weeklyDistance: weekly,
    avgPace: avgPace,
    paceTrend: trend,
    rollingMileageAvg: rolling_4wk_avg,
    weeklyGoal: weeklyGoal,
  };
};

exports.getTrainingLoad = async (athleteId) => {
  const [week, lastWeek, stats, weeklyGoal] = await Promise.all([
    getRolling7DayLoad(athleteId),
    getLastWeekLoad(athleteId),
    getRolling7DayStats(athleteId),
    getRollingWeeklyGoal(athleteId),
  ]);

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

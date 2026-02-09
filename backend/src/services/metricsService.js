const {
  getWeeklyMileage,
  getPaceTrend,
  getRollingFourWeekAverage,
  getAveragePaceByMiles,
} = require("../repositories/metricsRepo");

exports.getPerformanceMetrics = async (athleteId) => {
  const weekly = await getWeeklyMileage(athleteId);
  const trend = await getPaceTrend(athleteId);
  const rolling_4wk_avg = await getRollingFourWeekAverage(athleteId);
  const avgPace = await getAveragePaceByMiles(athleteId);

  return {
    weeklyDistance: weekly,
    avgPace: avgPace,
    paceTrend: trend,
    rollingMileageAvg: rolling_4wk_avg,
  };
};

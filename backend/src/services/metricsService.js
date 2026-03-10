const {
  getRolling7DayLoad,
  getRollingFourWeekAverage,
  getAveragePaceByMiles,
  getRollingPaceTrend,
  getRollingMileage,
  getPaceTrend,
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
  };
};

exports.getTrainingLoad = async (athleteId) => {
  return await getRolling7DayLoad(athleteId);
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

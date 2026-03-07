const { getRollingAcwr } = require("../repositories/metricsRepo");
const { computeInjuryRisk } = require("../services/injuryRiskService");
const {
  getPerformanceMetrics,
  getTrainingLoad,
  getPaceTrend,
  getAveragePace,
  getMileage,
} = require("../services/metricsService");

exports.performance = async (req, res) => {
  try {
    const athleteId = req.user.id;
    const metrics = await getPerformanceMetrics(athleteId);
    res.json(metrics);
  } catch (err) {
    res.status(500).send("Metrics failed");
  }
};

exports.load = async (req, res) => {
  try {
    const athleteId = req.user.id;
    const load = await getTrainingLoad(athleteId);
    res.json(load);
  } catch (err) {
    res.status(500).send("Fetching Load Failed");
  }
};

exports.mileage = async (req, res) => {
  try {
    const athleteId = req.user.id;
    const weeklyLoad = await getMileage(athleteId);
    res.json(weeklyLoad);
  } catch (err) {
    res.status(500).send("Fetching Weekly Load Failed");
  }
};

exports.paceTrend = async (req, res) => {
  try {
    const athleteId = req.user.id;
    const paceTrend = await getPaceTrend(athleteId);
    res.json(paceTrend);
  } catch (err) {
    res.status(500).send("Fetching Pace Trend Failed");
  }
};

exports.paceAvg = async (req, res) => {
  try {
    const athleteId = req.user.id;
    const paceAvg = await getAveragePace(athleteId);
    res.json(paceAvg);
  } catch (err) {
    res.status(500).send("Fetching Pace Trend Failed");
  }
};

exports.injury = async (req, res) => {
  try {
    const athleteId = req.user.id;

    const data = await getRollingAcwr(athleteId);
    if (!data) {
      return res.json({
        acwr: 0,
        risk: "NO_DATA",
        acuteMiles: 0,
        chronicMiles: 0,
      });
    }
    console.log(data);

    const result = computeInjuryRisk(data.acute_load, data.chronic_load);

    res.json(result);
  } catch (err) {
    res.status(500).send("Failed to calculate injury risk");
  }
};

exports.overview = async (req, res) => {
  try {
    const athleteId = req.user.id;

    const metrics = await getPerformanceMetrics(athleteId);
    const load = await getRollingAcwr(athleteId);

    let injuryRisk = {
      acwr: 0,
      risk: "NO_DATA",
      acuteMiles: 0,
      chronicMiles: 0,
    };

    if (load) {
      injuryRisk = computeInjuryRisk(load.acute_load, load.chronic_load);
    }

    res.json({
      ...metrics,
      injuryRisk,
    });
  } catch (err) {
    res.status(500).send("Failed to fetch overview metrics");
  }
};

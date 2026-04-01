const { getRollingAcwr, getRollingWeeklyGoal, upsertWeeklyGoal } = require("../repositories/metricsRepo");
const { computeInjuryRisk } = require("../services/injuryRiskService");
const {
  getPerformanceMetrics,
  getTrainingLoad,
  getPaceTrend,
  getAveragePace,
  getMileage,
  getHeatmapData,
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
    const range = req.query.range || "1m";
    const ranges = {
      "1m": 5,
      "3m": 13,
      "6m": 26,
      "1y": 52,
    };

    const weeks = ranges[range] || 5;
    const athleteId = req.user.id;
    const weeklyLoad = await getMileage(athleteId, weeks);
    res.json(weeklyLoad);
  } catch (err) {
    res.status(500).send("Fetching Weekly Load Failed");
  }
};

exports.paceTrend = async (req, res) => {
  try {
    const range = req.query.range || "1m";

    const ranges = {
      "1m": 5,
      "3m": 13,
      "6m": 26,
      "1y": 52,
    };

    const weeks = ranges[range] || 5;

    const athleteId = req.user.id;
    const paceTrend = await getPaceTrend(athleteId, weeks);
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

    const result = computeInjuryRisk(data.acute_load, data.chronic_load);

    res.json(result);
  } catch (err) {
    res.status(500).send("Failed to calculate injury risk");
  }
};

exports.setGoal = async (req, res) => {
  try {
    const athleteId = req.user.id;
    const { target } = req.body;
    if (!target || isNaN(target) || target <= 0) {
      return res.status(400).json({ error: "Invalid target" });
    }
    const goal = await upsertWeeklyGoal(athleteId, Number(target));
    res.json(goal);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Failed to set goal" });
  }
};

exports.heatmap = async (req, res) => {
  try {
    const metric = req.query.metric || "distance";
    const athleteId = req.user.id;
    const data = await getHeatmapData(athleteId, metric);
    res.json(data, "data");
  } catch (err) {
    res.status(500).send("Fetching HeatMap Failed");
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

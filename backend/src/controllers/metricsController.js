const { getAcuteChronicLoad } = require("../repositories/metricsRepo");
const { computeInjuryRisk } = require("../services/injuryRiskService");
const { getPerformanceMetrics } = require("../services/metricsService");

exports.performance = async (req, res) => {
  try {
    const athleteId = req.user.id;
    const metrics = await getPerformanceMetrics(athleteId);
    res.json(metrics);
  } catch (err) {
    console.error(err);
    res.status(500).send("Metrics failed");
  }
};

exports.injury = async (req, res) => {
  try {
    const athleteId = req.user.id;

    const data = await getAcuteChronicLoad(athleteId);
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
    console.error(err);
    res.status(500).send("Failed to calculate injury risk");
  }
};

exports.overview = async (req, res) => {
  try {
    const athleteId = req.user.id;

    const metrics = await getPerformanceMetrics(athleteId);
    const load = await getAcuteChronicLoad(athleteId);

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
    console.error(err);
    res.status(500).send("Failed to fetch overview metrics");
  }
};

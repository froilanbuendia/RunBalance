const { createStravaApi } = require("../utils/stravaApi");

exports.getAthlete = async (req, res) => {
  try {
    const athleteId = req.athlete.athleteId;
    const stravaApi = await createStravaApi(athleteId);

    const data = await stravaApi.get("/athlete");
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).send("Failed to fetch athlete");
  }
};

// GET /athlete/zones
exports.getZones = async (req, res) => {
  try {
    const athleteId = req.athlete.athleteId;
    const stravaApi = await createStravaApi(athleteId);
    console.log("athleteId", athleteId);

    const data = await stravaApi.get("/athlete/zones");
    res.json(data);
  } catch (err) {
    console.error(err.message || err);
    res.status(500).send("Failed to fetch zones.");
  }
};

// GET /athlete/stats
exports.getStats = async (req, res) => {
  try {
    const athleteId = req.athlete.athleteId;
    const stravaApi = await createStravaApi(athleteId);

    const data = await stravaApi.get(`/athletes/${athleteId}/stats`);
    res.json(data);
  } catch (err) {
    console.error(err.message || err);
    res.status(500).send("Failed to fetch stats.");
  }
};

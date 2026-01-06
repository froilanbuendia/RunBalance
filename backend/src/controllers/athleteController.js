const stravaApi = require("../utils/axiosInstance");

// GET /athlete
exports.getAthlete = async (req, res) => {
  try {
    const response = await stravaApi.get("/athlete");
    res.json(response.data);
  } catch (err) {
    console.error(err.response?.data || err);
    res.status(500).send("Failed to fetch athlete.");
  }
};

// GET /athlete/zones
exports.getZones = async (req, res) => {
  try {
    const response = await stravaApi.get("/athlete/zones");
    res.json(response.data);
  } catch (err) {
    console.error(err.response?.data || err);
    res.status(500).send("Failed to fetch zones.");
  }
};

// GET /athlete/stats
exports.getStats = async (req, res) => {
  try {
    // Replace "142069063" with dynamic athlete ID if needed
    const response = await stravaApi.get(
      `/athletes/${process.env.PERSONAL_ID}/stats`
    );
    res.json(response.data);
  } catch (err) {
    console.error(err.response?.data || err);
    res.status(500).send("Failed to fetch stats.");
  }
};

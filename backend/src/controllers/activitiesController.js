const stravaApi = require("../utils/axiosInstance");

exports.getActivities = async (req, res) => {
  try {
    const response = await stravaApi.get("/athlete/activities", {
      params: { per_page: 10 }, // fetch 10 most recent
    });
    res.json(response.data);
  } catch (err) {
    console.error(err.response?.data || err);
    res.status(500).send("Failed to fetch activities");
  }
};

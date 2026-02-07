const { getValidAccessToken } = require("../controllers/authController");

const STRAVA_BASE_URL = "https://www.strava.com/api/v3";

/**
 * Create a per-user Strava API client
 * @param {number} athleteId - numeric DB ID of the athlete
 */
const createStravaApi = async (athleteId) => {
  if (typeof athleteId !== "number") {
    throw new Error("athleteId must be a numeric DB ID");
  }

  // Fetch a valid Strava access token for this athlete
  const token = await getValidAccessToken(athleteId);

  const request = async (path, options = {}) => {
    const res = await fetch(`${STRAVA_BASE_URL}${path}`, {
      ...options,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Strava API error: ${errText}`);
    }

    return res.json();
  };

  return {
    get: (path) => request(path),
    post: (path, body) =>
      request(path, { method: "POST", body: JSON.stringify(body) }),
  };
};

/**
 * Fetch activities for a given athlete and page
 * @param {number} athleteId - numeric DB ID
 * @param {number} page - page number for Strava pagination
 * @returns {Promise<Array>} array of activities
 */
const fetchActivities = async (athleteId, page = 1) => {
  if (typeof athleteId !== "number") {
    throw new Error("athleteId must be a numeric DB ID");
  }

  const client = await createStravaApi(athleteId);

  return client.get(`/athlete/activities?per_page=200&page=${page}`);
};

module.exports = { createStravaApi, fetchActivities };

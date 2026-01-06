const axios = require("axios");
const { getValidAccessToken } = require("../controllers/authController");

const stravaApi = axios.create({
  baseURL: "https://www.strava.com/api/v3",
});

/**
 * Automatically attach valid access token to every request
 */
stravaApi.interceptors.request.use(
  async (config) => {
    const token = await getValidAccessToken();
    config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

module.exports = stravaApi;

const axios = require("axios");
const { URLSearchParams } = require("url"); // ✅ required in Node
const stravaConfig = require("../config/strava");

// In-memory token storage (replace with DB later)
let accessToken = null;
let refreshToken = null;
let expiresAt = null;

/**
 * Redirect user to Strava OAuth
 */
exports.redirectToStrava = (req, res) => {
  const params = new URLSearchParams({
    client_id: stravaConfig.clientId,
    redirect_uri: stravaConfig.redirectUri,
    response_type: "code",
    scope: "activity:read_all,profile:read_all",
    approval_prompt: "auto",
  });

  res.redirect(`${stravaConfig.authUrl}?${params.toString()}`);
};

/**
 * Handle OAuth callback
 */
exports.handleCallback = async (req, res) => {
  const { code } = req.query;

  if (!code) {
    return res.status(400).send("Authorization code missing.");
  }

  try {
    const response = await axios.post(stravaConfig.tokenUrl, {
      client_id: stravaConfig.clientId,
      client_secret: stravaConfig.clientSecret,
      code,
      grant_type: "authorization_code",
    });

    accessToken = response.data.access_token;
    refreshToken = response.data.refresh_token;
    expiresAt = response.data.expires_at;

    if (!accessToken || !refreshToken || !expiresAt) {
      throw new Error("Invalid token response from Strava");
    }

    const athleteName = response.data.athlete?.firstname || "Athlete";

    res.send(`Authorization successful. Welcome ${athleteName}!`);
  } catch (err) {
    console.error("OAuth error:", err.response?.data || err.message);
    res.status(500).send("Authorization failed.");
  }
};

/**
 * Refresh Strava access token
 */
async function refreshAccessToken() {
  if (!refreshToken) {
    throw new Error("Missing refresh token");
  }

  try {
    const response = await axios.post(stravaConfig.tokenUrl, {
      client_id: stravaConfig.clientId,
      client_secret: stravaConfig.clientSecret,
      grant_type: "refresh_token",
      refresh_token: refreshToken,
    });

    accessToken = response.data.access_token;
    refreshToken = response.data.refresh_token; // Strava rotates refresh tokens
    expiresAt = response.data.expires_at;

    console.log("Strava access token refreshed");
  } catch (err) {
    console.error(
      "Failed to refresh Strava token:",
      err.response?.data || err.message
    );
    throw err;
  }
}

/**
 * Get a valid access token (refresh if expired)
 */
exports.getValidAccessToken = async () => {
  if (!accessToken) {
    throw new Error("Not authenticated with Strava");
  }

  const now = Math.floor(Date.now() / 1000);

  // ⏱ Refresh 60s early to avoid race conditions
  if (now >= expiresAt - 60) {
    await refreshAccessToken();
  }

  return accessToken;
};

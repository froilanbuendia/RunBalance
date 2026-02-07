const axios = require("axios");
const {
  upsertAthlete,
  saveAthleteTokens,
  getAthleteTokens,
} = require("../repositories/athletes");
const jwt = require("jsonwebtoken");
const stravaConfig = require("../config/strava");

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
  console.log(
    "url check:",
    stravaConfig.authUrl,
    params,
    process.env.FRONTEND_URL
  );

  res.redirect(`${stravaConfig.authUrl}?${params.toString()}`);
};

/**
 * Handle OAuth callback from Strava
 */
exports.handleCallback = async (req, res) => {
  try {
    const { code } = req.query;
    if (!code) throw new Error("Authorization code missing");

    // Exchange code for tokens
    const { data } = await axios.post(stravaConfig.tokenUrl, {
      client_id: stravaConfig.clientId,
      client_secret: stravaConfig.clientSecret,
      code,
      grant_type: "authorization_code",
    });

    const athlete = data.athlete;

    // Save athlete info + tokens
    await upsertAthlete(athlete, data);
    await saveAthleteTokens(athlete.id, {
      access_token: data.access_token,
      refresh_token: data.refresh_token,
      expires_at: data.expires_at,
    });

    // Generate JWT for frontend
    const token = jwt.sign(
      { athleteId: athlete.id, stravaId: athlete.id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Redirect back to frontend
    res.redirect(`${process.env.FRONTEND_URL}/auth/callback?token=${token}`);
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).send("Authentication failed");
  }
};

/**
 * Refresh Strava access token for a specific athlete
 */
async function refreshAccessToken(athleteId) {
  const tokens = await getAthleteTokens(athleteId);
  if (!tokens?.refresh_token) throw new Error("Missing refresh token");

  const response = await axios.post(stravaConfig.tokenUrl, {
    client_id: stravaConfig.clientId,
    client_secret: stravaConfig.clientSecret,
    grant_type: "refresh_token",
    refresh_token: tokens.refresh_token,
  });

  const newTokens = {
    access_token: response.data.access_token,
    refresh_token: response.data.refresh_token,
    expires_at: response.data.expires_at,
  };

  await saveAthleteTokens(athleteId, newTokens);
  console.log(`Strava token refreshed for athlete ${athleteId}`);
  return newTokens.access_token;
}

/**
 * Get a valid access token for an athlete (refresh if expired)
 */
exports.getValidAccessToken = async (athleteId) => {
  const tokens = await getAthleteTokens(athleteId);
  if (!tokens?.access_token) throw new Error("Not authenticated with Strava");

  const now = Math.floor(Date.now() / 1000);
  if (now >= tokens.expires_at - 60) {
    return await refreshAccessToken(athleteId);
  }

  return tokens.access_token;
};

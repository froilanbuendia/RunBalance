// config/strava.js
module.exports = {
  clientId: process.env.STRAVA_CLIENT_ID,
  clientSecret: process.env.STRAVA_CLIENT_SECRET,
  authUrl: "https://www.strava.com/oauth/authorize",
  tokenUrl: "https://www.strava.com/oauth/token",
  redirectUri: process.env.STRAVA_REDIRECT_URI, // FULL URL
};

require("dotenv").config();
const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// In-memory storage for demo
let accessToken = null;

// Step 1: Redirect user to Strava to authorize
app.get("/auth/strava", (req, res) => {
  const params = new URLSearchParams({
    client_id: process.env.STRAVA_CLIENT_ID,
    redirect_uri: process.env.STRAVA_REDIRECT_URI,
    response_type: "code",
    scope: "activity:read_all,profile:read_all", // added profile:read_all
  });

  res.redirect(`https://www.strava.com/oauth/authorize?${params}`);
});

// Step 2: Handle Strava callback and exchange code for token
app.get("/auth/strava/callback", async (req, res) => {
  const { code } = req.query;

  try {
    const response = await axios.post("https://www.strava.com/oauth/token", {
      client_id: process.env.STRAVA_CLIENT_ID,
      client_secret: process.env.STRAVA_CLIENT_SECRET,
      code,
      grant_type: "authorization_code",
    });

    accessToken = response.data.access_token;
    res.send(
      "Authorization successful! You can now fetch activities at /activities"
    );
  } catch (err) {
    console.error(err.response?.data || err);
    res.status(500).send("Authorization failed");
  }
});

// Step 3: Fetch your own activities
app.get("/activities", async (req, res) => {
  if (!accessToken) return res.status(401).send("Not authorized");

  try {
    const response = await axios.get(
      "https://www.strava.com/api/v3/athlete/activities",
      {
        headers: { Authorization: `Bearer ${accessToken}` },
        params: { per_page: 10 }, // fetch 10 most recent activities
      }
    );
    res.json(response.data);
  } catch (err) {
    console.error(err.response?.data || err);
    res.status(500).send("Failed to fetch activities");
  }
});

app.get(`/athlete`, async (req, res) => {
  if (!accessToken) return res.status(401).send("Not authorized");

  try {
    const response = await axios.get(`https://www.strava.com/api/v3/athlete`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    res.json(response.data);
  } catch (err) {
    console.error(err.response?.data || err);
    res.status(500).send("Failed to fetch athlete.");
  }
});

app.get(`/athlete/zones`, async (req, res) => {
  if (!accessToken) return res.status(401).send("Not authorized");

  try {
    const response = await axios.get(
      `https://www.strava.com/api/v3/athlete/zones`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );
    res.json(response.data);
  } catch (err) {
    console.error(err.response?.data || err);
    res.status(500).send("Failed to fetch logged zones.");
  }
});

app.get(`/athlete/stats`, async (req, res) => {
  if (!accessToken) return res.status(401).send("Not authorized");

  try {
    const response = await axios.get(
      `https://www.strava.com/api/v3/athletes/${process.env.PERSONAL_ID}/stats`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );
    res.json(response.data);
  } catch (err) {
    console.error(err.response?.data || err);
    res.status(500).send("Failed to fetch athlete stats.");
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

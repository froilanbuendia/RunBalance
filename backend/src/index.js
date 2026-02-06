require("dotenv").config();
const { pool } = require("./database/db.js");

const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth");
const athleteRoutes = require("./routes/athlete");
const activitiesRoutes = require("./routes/activities");
const healthCheckRoutes = require("./routes/healthcheck");

const app = express();
app.use(cors({ origin: "*" }));
app.use(express.json());

// Routes
app.use("api/hc", healthCheckRoutes);
app.use("api/auth", authRoutes);
app.use("api/athlete", athleteRoutes);
app.use("api/activities", activitiesRoutes);

app.get("/api/health/db", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json({ ok: true, time: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: err.message });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

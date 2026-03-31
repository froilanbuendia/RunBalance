const { fetchActivities, createStravaApi } = require("../utils/stravaApi");
const {
  upsertActivity,
  getActivitiesByAthlete,
  countActivities,
  getRunStats,
  getPersonalRecords,
  getStreak,
  getRunTypeBreakdown,
} = require("../repositories/activities");

/**
 * GET /api/activities
 * Fetch the latest 10 activities for the current athlete
 */
exports.getActivities = async (req, res) => {
  try {
    // Use the numeric DB ID from the authenticated user
    const athleteId = Number(req.user.id);
    if (Number.isNaN(athleteId)) {
      throw new Error("Invalid athlete ID");
    }

    const stravaApi = await createStravaApi(athleteId);

    const data = await stravaApi.get("/athlete/activities?per_page=10");

    res.json(data);
  } catch (err) {
    console.error(err.message || err);
    res.status(500).send("Failed to fetch activities");
  }
};

/**
 * GET /api/activities/history
 * Fetch paginated activities from the DB for the current athlete
 */
exports.getHistory = async (req, res) => {
  try {
    const athleteId = Number(req.user.id);
    if (Number.isNaN(athleteId)) throw new Error("Invalid athlete ID");

    const limit = Math.min(parseInt(req.query.limit) || 20, 100);
    const offset = parseInt(req.query.offset) || 0;
    const type = req.query.type || null;

    const [activities, countRow] = await Promise.all([
      getActivitiesByAthlete(athleteId, { limit, offset, type }),
      countActivities(athleteId, type),
    ]);

    res.json({ activities, total: Number(countRow.total), limit, offset });
  } catch (err) {
    console.error(err.message || err);
    res.status(500).send("Failed to fetch activity history");
  }
};

/**
 * GET /api/activities/stats
 * Returns all-time run totals for the current athlete
 */
exports.getStats = async (req, res) => {
  try {
    const athleteId = Number(req.user.id);
    if (Number.isNaN(athleteId)) throw new Error("Invalid athlete ID");

    const stats = await getRunStats(athleteId);
    res.json({
      totalRuns: Number(stats.total_runs),
      totalMiles: parseFloat(stats.total_miles),
      totalSeconds: Number(stats.total_seconds),
    });
  } catch (err) {
    console.error(err.message || err);
    res.status(500).send("Failed to fetch run stats");
  }
};

/**
 * GET /api/activities/streak
 */
exports.getStreak = async (req, res) => {
  try {
    const athleteId = Number(req.user.id);
    if (Number.isNaN(athleteId)) throw new Error("Invalid athlete ID");
    const streak = await getStreak(athleteId);
    res.json({ streak });
  } catch (err) {
    console.error(err.message || err);
    res.status(500).send("Failed to fetch streak");
  }
};

/**
 * GET /api/activities/run-type-breakdown
 */
exports.getRunTypeBreakdown = async (req, res) => {
  try {
    const athleteId = Number(req.user.id);
    if (Number.isNaN(athleteId)) throw new Error("Invalid athlete ID");
    const row = await getRunTypeBreakdown(athleteId);
    res.json({
      short:  Number(row.short_count),
      medium: Number(row.medium_count),
      long:   Number(row.long_count),
    });
  } catch (err) {
    console.error(err.message || err);
    res.status(500).send("Failed to fetch run type breakdown");
  }
};

/**
 * GET /api/activities/personal-records
 * Returns computed PRs for common race distances
 */
exports.getPersonalRecords = async (req, res) => {
  try {
    const athleteId = Number(req.user.id);
    if (Number.isNaN(athleteId)) throw new Error("Invalid athlete ID");

    const row = await getPersonalRecords(athleteId);
    res.json({
      mile:     row.mile_seconds     ? Number(row.mile_seconds)     : null,
      fiveK:    row.fivek_seconds    ? Number(row.fivek_seconds)    : null,
      tenK:     row.tenk_seconds     ? Number(row.tenk_seconds)     : null,
      half:     row.half_seconds     ? Number(row.half_seconds)     : null,
      marathon: row.marathon_seconds ? Number(row.marathon_seconds) : null,
    });
  } catch (err) {
    console.error(err.message || err);
    res.status(500).send("Failed to fetch personal records");
  }
};

/**
 * POST /api/activities/sync
 * Fetch all activities from Strava and upsert into the DB
 */
exports.syncActivities = async (req, res) => {
  try {
    const athleteId = Number(req.user.id);
    if (Number.isNaN(athleteId)) {
      throw new Error("Invalid athlete ID");
    }

    if (typeof athleteId !== "number") {
      throw new Error("Invalid athlete ID");
    }

    let page = 1;
    let inserted = 0;
    console.log("Syncing activities for athlete", athleteId);

    while (true) {
      const activities = await fetchActivities(athleteId, page);
      if (!activities || activities.length === 0) break;

      for (const activity of activities) {
        await upsertActivity(activity, athleteId);
        inserted++;
      }

      page++;
    }

    res.json({
      message: "Activities synced",
      count: inserted,
    });
  } catch (err) {
    console.error(err.message || err);
    res.status(500).send("Failed to sync activities");
  }
};

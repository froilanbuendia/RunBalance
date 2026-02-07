const { fetchActivities, createStravaApi } = require("../utils/stravaApi");
const { upsertActivity } = require("../repositories/activities");

/**
 * GET /api/activities
 * Fetch the latest 10 activities for the current athlete
 */
exports.getActivities = async (req, res) => {
  try {
    // Use the numeric DB ID from the authenticated user
    const athleteId = req.user.id;

    if (typeof athleteId !== "number") {
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

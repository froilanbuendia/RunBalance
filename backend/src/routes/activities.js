const express = require("express");
const router = express.Router();
const activitiesController = require("../controllers/activitiesController");
const authMiddleware = require("../middleware/auth");

router.get("/stats", authMiddleware, activitiesController.getStats);
router.get("/streak", authMiddleware, activitiesController.getStreak);
router.get("/run-type-breakdown", authMiddleware, activitiesController.getRunTypeBreakdown);
router.get("/personal-records", authMiddleware, activitiesController.getPersonalRecords);
router.get("/history", authMiddleware, activitiesController.getHistory);
router.get("/", authMiddleware, activitiesController.getActivities);
router.post(
  "/sync",
  authMiddleware,
  (req, res, next) => {
    next();
  },
  activitiesController.syncActivities,
);
module.exports = router;

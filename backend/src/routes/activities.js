const express = require("express");
const router = express.Router();
const activitiesController = require("../controllers/activitiesController");
const authMiddleware = require("../middleware/auth");

router.get("/", authMiddleware, activitiesController.getActivities);
router.post(
  "/sync",
  authMiddleware,
  (req, res, next) => {
    console.log("POST /api/activities/sync hit!");
    next();
  },
  activitiesController.syncActivities
);
module.exports = router;

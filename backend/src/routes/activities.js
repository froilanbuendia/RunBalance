const express = require("express");
const router = express.Router();
const activitiesController = require("../controllers/activitiesController");
const authMiddleware = require("../middleware/auth");

router.get("/", authMiddleware, activitiesController.getActivities);

module.exports = router;

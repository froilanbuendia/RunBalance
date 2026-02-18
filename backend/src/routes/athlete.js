const express = require("express");
const router = express.Router();
const athleteController = require("../controllers/athleteController");
const authMiddleware = require("../middleware/auth");

router.get("/", athleteController.getAthlete);
router.get("/zones", athleteController.getZones);
router.get("/stats", athleteController.getStats);
router.get("/profile", authMiddleware, athleteController.getAthleteProfile);

module.exports = router;

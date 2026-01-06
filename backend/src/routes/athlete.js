const express = require("express");
const router = express.Router();
const athleteController = require("../controllers/athleteController");

router.get("/", athleteController.getAthlete);
router.get("/zones", athleteController.getZones);
router.get("/stats", athleteController.getStats);

module.exports = router;

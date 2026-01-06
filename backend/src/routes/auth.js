const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

router.get("/strava", authController.redirectToStrava);
router.get("/strava/callback", authController.handleCallback);

module.exports = router;

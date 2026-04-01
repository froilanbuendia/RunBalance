const express = require("express");
const healthCheckController = require("../controllers/healthCheckController");

const router = express.Router();

router.get("/", healthCheckController.getHealthCheck);

module.exports = router;

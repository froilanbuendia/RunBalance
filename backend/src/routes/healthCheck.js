const express = require("express");
const healthCheckController = require("../controllers/healthcheckController");

const router = express.Router();

router.get("/", healthCheckController.getHealthCheck);

module.exports = router;

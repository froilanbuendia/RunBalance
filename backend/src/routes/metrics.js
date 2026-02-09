const express = require("express");
const router = express.Router();
const { performance, injury } = require("../controllers/metricsController");
const authMiddleware = require("../middleware/auth");

router.get("/performance", authMiddleware, performance);
router.get("/injury", authMiddleware, injury);

module.exports = router;

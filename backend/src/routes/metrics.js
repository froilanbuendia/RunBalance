const express = require("express");
const router = express.Router();
const {
  performance,
  injury,
  overview,
  load,
  paceTrend,
  paceAvg,
  mileage,
} = require("../controllers/metricsController");
const authMiddleware = require("../middleware/auth");

router.get("/performance", authMiddleware, performance);
router.get("/load", authMiddleware, load);
router.get("/mileage", authMiddleware, mileage);
router.get("/pace-trend", authMiddleware, paceTrend);
router.get("/pace-avg", authMiddleware, paceAvg);
router.get("/injury", authMiddleware, injury);
router.get("/overview", authMiddleware, overview);

module.exports = router;

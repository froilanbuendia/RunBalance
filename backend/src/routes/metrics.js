const express = require("express");
const router = express.Router();
const {
  performance,
  injury,
  overview,
} = require("../controllers/metricsController");
const authMiddleware = require("../middleware/auth");

router.get("/performance", authMiddleware, performance);
router.get("/injury", authMiddleware, injury);
router.get("/overview", authMiddleware, overview);

module.exports = router;

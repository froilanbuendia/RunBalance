const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { getHistory, sendMessage } = require("../controllers/chatController");

router.get("/history", auth, getHistory);
router.post("/", auth, sendMessage);

module.exports = router;
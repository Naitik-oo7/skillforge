const express = require("express");
const authMiddleware = require("../middleware/auth");
const {
  getUserStats,
  getLeaderboard,
} = require("../controllers/statsController");
const router = express.Router();

router.get("/user/:userId", authMiddleware, getUserStats);
router.get("/leaderboard", authMiddleware, getLeaderboard);

module.exports = router;

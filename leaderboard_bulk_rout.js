const express = require("express");
const router = express.Router();
const leaderboardController = require("../controllers/leaderboardController");
const authMiddleware = require("../middleware/authMiddleware");

// Get leaderboard data with optional filtering by role and time range
router.get("/", authMiddleware, leaderboardController.getLeaderboard);

module.exports = router;

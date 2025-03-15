const TaskChangeHistory = require("../models/TaskChangeHistory");
const User = require("../models/User");
const mongoose = require("mongoose");

// Get aggregated leaderboard data based on task changes
exports.getLeaderboard = async (req, res) => {
  try {
    const { timeRange, role } = req.query;
    
    // Define date range based on timeRange parameter
    let dateFilter = {};
    const now = new Date();
    
    if (timeRange === "weekly") {
      // Last 7 days
      const lastWeek = new Date(now);
      lastWeek.setDate(now.getDate() - 7);
      dateFilter = { lastUpdated: { $gte: lastWeek } };
    } else if (timeRange === "monthly") {
      // Last 30 days
      const lastMonth = new Date(now);
      lastMonth.setDate(now.getDate() - 30);
      dateFilter = { lastUpdated: { $gte: lastMonth } };
    } else if (timeRange === "quarterly") {
      // Last 90 days
      const lastQuarter = new Date(now);
      lastQuarter.setDate(now.getDate() - 90);
      dateFilter = { lastUpdated: { $gte: lastQuarter } };
    }
    // If all-time or invalid value, no date filter will be applied

    // Build the aggregation pipeline
    const pipeline = [
      // Match by date if applicable
      dateFilter.lastUpdated ? { $match: dateFilter } : { $match: {} },
      
      // Match by role if specified
      role ? {
        $lookup: {
          from: "users",
          localField: "changeBy",
          foreignField: "username",
          as: "userInfo"
        }
      } : { $match: {} },
      
      // Only include records with status change to "Completed" or "Reviewed"
      {
        $match: {
          statusChangeTo: { $in: ["Completed", "Reviewed"] }
        }
      },
      
      // If role is specified, filter by role
      ...(role ? [
        { $unwind: "$userInfo" },
        { $match: { "userInfo.role": role } }
      ] : []),
      
      // Group by username and count completed tasks
      {
        $group: {
          _id: "$changeBy",
          userName: { $first: "$changeBy" },
          role: { $first: role || "$userInfo.role" },
          tasksCompleted: { $sum: 1 },
          lastActivity: { $max: "$lastUpdated" }
        }
      },
      
      // Sort by number of completed tasks (descending)
      {
        $sort: { tasksCompleted: -1, lastActivity: -1 }
      },
      
      // Limit to top 50 performers
      {
        $limit: 50
      }
    ].filter(stage => Object.keys(stage).length > 0); // Remove empty stages

    const leaderboardData = await TaskChangeHistory.aggregate(pipeline);
    
    return res.status(200).json(leaderboardData);
    
  } catch (error) {
    console.error("Error fetching leaderboard data:", error);
    return res.status(500).json({ message: "Failed to fetch leaderboard data" });
  }
};

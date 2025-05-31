const Submission = require("../models/Submission");
const mongoose = require("mongoose");

async function getUserStats(req, res) {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const stats = await Submission.aggregate([
      { $match: { user: mongoose.Types.ObjectId(userId) } },

      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    const response = {
      total: 0,
      passed: 0,
      failed: 0,
      pending: 0,
    };

    stats.forEach((stat) => {
      const status = stat._id.toLowerCase();
      const count = stat.count;
      response.total += count;

      if (status === "passed") response.passed = count;
      else if (status === "failed") response.failed = count;
      else if (status === "pending") response.pending = count;
    });

    return res.json(response);
  } catch (error) {
    console.error("Error in getUserStats:", error);
    return res.status(500).json({ message: "Server error" });
  }
}

async function getLeaderboard(req, res) {
  try {
    const leaderboard = await Submission.aggregate([
      { $match: { status: "Passed" } },

      {
        $group: {
          _id: "$user",
          passedCount: { $sum: 1 },
        },
      },

      { $sort: { passedCount: -1 } },

      { $limit: 5 },

      {
        $lookup: {
          from: "users",
          localField: "_id", 
          foreignField: "_id", 
          as: "userInfo",
        },
      },

      { $unwind: "$userInfo" },

      {
        $project: {
          _id: 0,
          userId: "$_id",
          username: "$userInfo.username",
          name: "$userInfo.name",
          passedCount: 1,
        },
      },
    ]);

    return res.json(leaderboard);
  } catch (error) {
    console.error("Error in getLeaderboard:", error);
    return res.status(500).json({ message: "Server error" });
  }
}

module.exports = { getUserStats, getLeaderboard };

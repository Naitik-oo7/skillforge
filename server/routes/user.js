const express = require("express");
const authMiddleware = require("../middleware/auth");
const User = require("../models/user");
const router = express.Router();

router.get("/profile", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password"); //   
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    console.error(error), res.status(500).json({ message: "Server eror" });
  }
});

module.exports = router;

const express = require("express");
const authMiddleware = require("../middleware/auth");
const Challenge = require("../models/Challenge");
const app = express();
const router = express.Router();

router.post("/", authMiddleware, async (req, res) => {
  try {
    const newChallenge = new Challenge({
      ...req.body,
      createdBy: req.user.id,
    });

    await newChallenge.save();
    res.status(201).json(newChallenge);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const challenges = await Challenge.find()
      .populate("skill")
      .populate("createdBy", "name email");
    res.json(challenges);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const challenge = await Challenge.findById(req.params.id)
      .populate("skill")
      .populate("createdBy", "name email");
    if (!challenge) {
      return res.json({ message: "Challenge not found" });
    }
    res.json(challenge);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});



router.patch("/:id", authMiddleware, async (req, res) => {
  try {
    const challenge = await Challenge.findById(req.params.id);
    if (!challenge) {
      return res.status(404).json({ message: "Challenge not found" });
    }

    if (challenge.createdBy !== req.user.id) {
      res.status(403).json({ message: "Not authorized" });
    }
    Object.assign(challenge, req.body);
    const updatedChallenge = await challenge.save();
    res.json(updatedChallenge);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const challenge = await Challenge.findById(req.params.id);
    if (!challenge) {
      return res.json({ message: "Challenge not Found" });
    }
    if (challenge.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await challenge.deleteOne();
    res.json({ message: "Challenge Deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
module.exports = router;

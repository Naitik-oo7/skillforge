const express = require("express");
const authMiddleware = require("../middleware/auth");
const Submission = require("../models/Submission");
const router = express.Router();
const app = express();

app.use(express.json());
//Post a submission
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { skill, code, challenge } = req.body;
    const newSubmission = new Submission({
      user: req.user.id,
      skill,
      challenge,
      code,
      result: "Pending",
    });
    await newSubmission.save();
    res.status(201).json(newSubmission);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//Get /api/submissions/:id - Getting a single submission by id
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const submission = await Submission.findById(req.params.id)
      .populate("user", "name email")
      .populate("skill", "name");
    if (!submission) {
      return res.status(404).json({ message: "Submission not found" });
    }
    res.json(submission);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//GET /api/submissions/user/:userId - All the submissions bt the user
router.get("/user/:userId", authMiddleware, async (req, res) => {
  try {
    const submissions = await Submission.find({ user: req.params.userId })
      .populate("skill", "name")
      .sort({ submittedAt: -1 });

    res.json(submissions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//Delete
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const submission = await Submission.findById(req.params.id);
    if (!submission) {
      return res.json({ message: "Submission not found" });
    }
    if (submission.user.toString() !== req.user.id) {
      return res.json({ message: "Not authorised" });
    }

    await submission.deleteOne();
    res.json({ message: "Submission deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Simulate code evaluation
router.post("/:id/evaluate", authMiddleware, async (req, res) => {
  try {
    const submission = await Submission.findById(req.params.id);
    if (!submission) {
      return res.status(404).json({ message: "Submission not found" });
    }

    if (submission.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "not authorised" });
    }

    const code = submission.code;
    const isPassed = code.trim().includes("console.log");

    submission.result = isPassed ? "Passed" : "Failed";
    await submission.save();
    res.json({ message: `Submission evaluated : ${submission.result}` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//get all sub for specific skills
router.get("/skill/:skillId", authMiddleware, async (req, res) => {
  try {
    const submissions = await Submission.find({ skill: req.params.skillId })
      .populate("user", "name email")
      .sort({ submittedAt: -1 });

    res.json(submissions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//Stats
router.get("/user/:userId/stats", authMiddleware, async (req, res) => {
  try {
    const submissions = await Submission.find({
      user: req.params.userId,
    }).populate("skill", "name");
    const totalSubmissions = submissions.length;
    const passedSubmissions = submissions.filter(
      (sub) => sub.result === "Passed"
    ).length;
    const failedSubmission = submissions.filter(
      (sub) => sub.result === "Failed"
    ).length;

    res.json({
      totalSubmissions,
      passedSubmissions,
      failedSubmission,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//all submission for specific challenge
router.get("/challenge/:challengeId", authMiddleware, async (req, res) => {
  try {
    const submissions = await Submission.find({
      challenge: req.params.challengeId,
    })
      .populate("user", "name email")
      .sort({ submittedAt: -1 });
    res.json(submissions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Manual Evaluation by Admin
router.patch("/:id/manual-evaluate", authMiddleware, async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      return res
        .status(403)
        .json({ message: "Only admins can manually evaluate submissions" });
    }

    const { result } = req.body;
    const submission = await Submission.findById(req.params.id);
    if (!submission) {
      return res.status(404).json({ message: "Submission not found" });
    }

    submission.result = result;
    await submission.save();

    res.json({
      message: `Submission manually evaluated: ${result}`,
      submission,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

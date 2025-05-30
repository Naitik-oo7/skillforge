const express = require("express");
const authMiddleware = require("../middleware/auth");
const Submission = require("../models/Submission");
const router = require("./auth");
const app = express();

app.use(express.json());

router.post("/", authMiddleware, async (req, res) => {
  try {
    const { skill, code } = req.body;
    const newSubmission = new Submission({
      user: req.user.id,
      skill,
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
    const submission = Submission.findById(req.params.id)
      .populate("user", "name email")
      .populate("skill", "name");
    if (!submission) {
      return res.json({ messaeg: "Submission not found" });
    }
    res.json(submission);
  } catch (error) {
    res.status(500).json({ messaeg: error.message });
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

//Deltee
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
    res.status(500).json({ messaeg: error.message });
  }
});

// Simulate code evaluation
router.post("/:id/evaluate", authMiddleware, async (req, res) => {
  try {
    const submission = Submission.findById(req.params.id);
    if (!submission) {
      return res.status(404).json({ message: "Submission not found" });
    }

    if (submission.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "not authorised" });
    }

    const code = submission.code;
    const isPassed = code.includes("console.log");

    submission.result = isPassed ? "Passed" : "Failed";
    await submission.save();
    res.json({ message: `Submission evaluated : ${submission.result}` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//get all sub for speccific sjkills

router.get("/skill/:skillId", authMiddleware, async (req, res) => {
  try {
    const submissions = Submission.find({ skill: req.params.skillId })
      .populate("user", "name email")
      .sort({ submittedAt: -1 });

    res.json(submissions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

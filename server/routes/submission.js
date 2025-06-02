const express = require("express");
const authMiddleware = require("../middleware/auth");
const Submission = require("../models/Submission");
const OpenAI = require("openai");
const evaluateSubmission = require("../utils/evaluateSubmission");

const router = express.Router();
const app = express();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

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

    // ✅ Auto-evaluate right after saving
    await evaluateSubmission(newSubmission);

    // Fetch the latest updated submission (with result & explanation)
    const evaluatedSubmission = await Submission.findById(newSubmission._id)
      .populate("skill", "name")
      .populate("challenge", "description");

    res.status(201).json(evaluatedSubmission);
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

router.post("/:id/evaluate", authMiddleware, async (req, res) => {
  try {
    const submission = await Submission.findById(req.params.id).populate(
      "challenge"
    );
    if (!submission) {
      return res.status(404).json({ message: "Submission not found" });
    }

    if (submission.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorised" });
    }

    const prompt = `
Challenge description:
${submission.challenge.description || "No description provided."}

User submitted code:
${submission.code || "No code provided."}

Does this code correctly solve the challenge? Reply only with "Passed" or "Failed" and a short explanation.
    `;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are an expert code evaluator." },
        { role: "user", content: prompt },
      ],
      max_tokens: 100,
      temperature: 0,
    });

    const aiResponse = completion.choices[0].message.content.trim();
    console.log("AI Response:", aiResponse); // Debug output

    // Robust result parsing
    let result;
    if (aiResponse.toLowerCase().includes("passed")) {
      result = "Passed";
    } else if (aiResponse.toLowerCase().includes("failed")) {
      result = "Failed";
    } else {
      result = "Pending"; // fallback if ambiguous
    }

    submission.result = result;
    submission.aiExplanation = aiResponse; // Save the explanation text

    await submission.save();

    res.json({ message: `Submission evaluated: ${result}`, aiResponse });
  } catch (error) {
    console.error("Error during AI evaluation:", error);
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

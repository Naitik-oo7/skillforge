const mongoose = require("mongoose");
const { string } = require("zod");

const submissionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
   
  },
  skill: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Skill",
    required: true,
  },
  code: {
    type: String,
    required: true,
  },
  result: {
    type: String,
    default: "Pending",
  },
  submittedAt: {
    type: Date,
    default: Date.now,
  },
  challenge: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Challenge",
    required: true,
  },
});

const Submission = mongoose.model("Submission", submissionSchema);

module.exports = Submission;

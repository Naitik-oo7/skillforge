const mongoose = require("mongoose");
const { applyTimestamps } = require("./user");

const skillSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    proficiency: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced", "Expert"],
      default: "Beginner",
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);
const Skill = mongoose.model("Skill", skillSchema);

module.exports = Skill;

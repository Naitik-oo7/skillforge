const mongoose = require("mongoose");

const globalSkillSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
  },
  { timestamps: true }
);

const GlobalSkill = mongoose.model("GlobalSkill", globalSkillSchema);

module.exports = GlobalSkill;

const GlobalSkill = require("../models/globalSkill");

// Add new global skill
const createGlobalSkill = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Skill name is required" });
    }

    const existingSkill = await GlobalSkill.findOne({ name });
    if (existingSkill) {
      return res.status(400).json({ message: "Skill already exists" });
    }

    const newSkill = await GlobalSkill.create({ name });
    res.status(201).json(newSkill);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all global skills
const getAllGlobalSkills = async (req, res) => {
  try {
    const skills = await GlobalSkill.find();
    res.status(200).json(skills);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createGlobalSkill, getAllGlobalSkills };

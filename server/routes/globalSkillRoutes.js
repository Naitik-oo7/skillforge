const express = require("express");
const router = express.Router();
const {
  createGlobalSkill,
  getAllGlobalSkills,
} = require("../controllers/globalSkillController");

// POST /api/globalskills
router.post("/", createGlobalSkill);

// GET /api/globalskills
router.get("/", getAllGlobalSkills);

module.exports = router;

const express = require("express");
const authMiddleware = require("../middleware/auth");
const { getUserStats } = require("../../controllers/statsController");
const router = express.Router();

router.get("/user/:userId", authMiddleware, getUserStats);

module.exports = router;

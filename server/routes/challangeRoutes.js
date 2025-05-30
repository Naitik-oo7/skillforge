const express = require("express");
const authMiddleware = require("../middleware/auth");
const Challange = require("../models/Challange");
const { findByIdAndDelete } = require("../models/user");
const { object } = require("zod");
const app = express();
const router = express.Router();

router.post("/", authMiddleware, async (req, res) => {
  try {
    const newChallange = new Challange({
      ...req.body,
      createdBy: req.user.id,
    });

    await newChallange.save();
    res.status(201).json(newChallange);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const challanges = await Challange.find()
      .populate("skill")
      .populate("createdBy", "name email");
    res.json(challanges);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const challange = await Challange.findById(req.params.id)
      .populate("skill")
      .populate("createdBy", "name email");
    if (!challange) {
      return res.json({ messaeg: "Challange not found" });
    }
    res.json(challange);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const updatedChallange = await Challange.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedChallange);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    await Challange.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Challange deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.patch("/:id", authMiddleware, async (req, res) => {
  try {
    const challange = Challange.findById(req.params.id);
    if (!challange) {
      return res.status(404).json({ message: "Challenge not found" });
    }

    if (challange.createdBy !== req.user.id) {
      res.status(403).json({ message: "Not authorized" });
    }
    object.assign(challange, req.body);
    const updatedChallange = await challange.save();
    res.json(updatedChallange);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const challange = Challange.findById(req.params.id);
    if (!challange) {
      return res.json({ message: "Challange not Found" });
    }
    if (challange.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await challange.deleteOne();
    res.json({ message: "Challange Deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
module.exports = router;

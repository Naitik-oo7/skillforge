const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { z } = require("zod");
const User = require("../models/user");

const router = express.Router();

router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    //Checking User
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    //Hash Pass
    const hashPass = await bcrypt.hash(password, 10);

    //New User Creation
    const user = await User.create({ name, email, password: hashPass });

    //token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Signup error : ", error);
    res.status(500).json({
      message: "Server error",
    });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    //Checking User
    const user = await User.findOne({ email });
    if (!user) {
      res.status(400).json({
        message: "User not found",
      });
    }

    //Pass check
    const passMatch = bcrypt.compare(password, user.password);
    if (!passMatch) {
      res.status(400).json({
        message: "Incorrect Password",
      });
    }

    //Token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(200).json({
      message: "Login Successfull",
      token,
    });
  } catch (error) {
    console.error("Login error :", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;

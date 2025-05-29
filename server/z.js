const express = require("express");
const User = require("./models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("dotenv").config();

const app = express();
app.use(express.json());
const mongoose = require("mongoose");
mongoose.connect(
  "mongodb+srv://dbUser:ArAoBSJ2BPKHlq8T@cluster0.c63yl7f.mongodb.net/testing-skillforge"
);

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(400).json({ message: "token not available or invalid" });
  }
  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.id = decoded.id;
    next();
  } catch (error) {
    return res.status(500).json({ message: "server error" });
  }
}

app.post("/api/auth/signup", async (req, res) => {
  try {
    const { email, password, name } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "user already exists" });
    }

    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ email, password: hash, name });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.status(200).json({ message: "signup success", token });
  } catch (error) {
    return res.status(500).json({ message: "servor Error" });
  }
});

app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
     return res.json({ message: "User does not exists" });
    }

    const passMatch = await bcrypt.compare(password, user.password);
    if (!passMatch) {
      return res.status(400).json({ message: "invalid credentials" });
    }

    const token = jwt.sign({id :user._id}, process.env.JWT_SECRET);
    res.status(200).json({ message: "Login success", token });
  } catch (error) {
    return res.status(500).json({ message: "Servor Error" });
  }
});

app.get("/api/user/profile", authMiddleware, async (req, res) => {
  const user = await User.findById(req.id).select("-password");
  return res.json(user);
});

app.listen(3000, () => console.log("Server running on 3000"));

const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const cors = require("cors");
const mongoose = require("mongoose");
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error : ", err));

const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const skillRoutes = require("./routes/skillRoutes");
const submissionRoutes = require("./routes/submission");
const challengeRoutes = require("./routes/challengeRoutes");
const statsRoutes = require("./routes/stats");


const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/skill", skillRoutes);
app.use("/api/submissions", submissionRoutes);
app.use("/api/challenges", challengeRoutes);
app.use('/api/stats',statsRoutes)

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

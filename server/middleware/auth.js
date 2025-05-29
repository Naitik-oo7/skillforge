const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  //Getting Token From req
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Authorization token missing" });
  }
  const token = authHeader.split(" ")[1];

  //Verifying token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = { id: decoded.id };

    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid Token" });
  }
};


module.exports = authMiddleware
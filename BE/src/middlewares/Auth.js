const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Yêu cầu có token
const verifyToken = async (req, res, next) => {
  const header = req.headers["authorization"];
  if (!header) return res.status(401).json({ message: "No token provided" });

  const [scheme, token] = header.split(" ");
  if (scheme !== "Bearer" || !token) {
    return res.status(401).json({ message: "Invalid authorization header" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");
    if (!user) return res.status(401).json({ message: "User not found" });
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

// Yêu cầu có 1 trong các role
const requireRole = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return res.status(403).json({ message: "Forbidden" });
  }
  next();
};

// Chủ sở hữu hoặc có 1 trong các role
const requireSelfOrRole = (...roles) => (req, res, next) => {
  const { id } = req.params;
  if (req.user && (req.user._id.toString() === id || roles.includes(req.user.role))) {
    return next();
  }
  return res.status(403).json({ message: "Forbidden" });
};

module.exports = { verifyToken, requireRole, requireSelfOrRole };

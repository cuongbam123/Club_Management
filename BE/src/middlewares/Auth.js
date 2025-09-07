const jwt = require("jsonwebtoken");
const User = require("../models/User");

// ================== VERIFY TOKEN ==================
const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Invalid authorization header" });
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("-password");
    if (!user) return res.status(401).json({ message: "User not found" });

    if (process.env.NODE_ENV !== "production") {
      console.log("✅ verifyToken OK:", { id: user._id.toString(), role: user.role });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error("❌ verifyToken error:", err.name);

    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired" });
    }
    return res.status(401).json({ message: "Invalid token" });
  }
};

// ================== REQUIRE ROLE ==================
const requireRole = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return res.status(403).json({ message: "Forbidden" });
  }
  next();
};

// ================== REQUIRE SELF OR ROLE ==================
const requireSelfOrRole = (...roles) => (req, res, next) => {
  const { id } = req.params;
  if (req.user && (req.user._id.toString() === id || roles.includes(req.user.role))) {
    return next();
  }
  return res.status(403).json({ message: "Forbidden" });
};

module.exports = { verifyToken, requireRole, requireSelfOrRole };

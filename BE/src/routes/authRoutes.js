const express = require("express");
const auth = require("../controllers/authController");
const { verifyToken } = require("../middlewares/auth");

const router = express.Router();


router.post("/register", auth.register);
router.post("/login", auth.login);
router.post("/forgot-password", auth.forgotPassword);

// trả về user + club (cần token)
router.get("/me", verifyToken, auth.me);

router.put("/me", verifyToken, auth.updateMe);

module.exports = router;

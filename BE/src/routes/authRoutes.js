const express = require("express");
const auth = require("../controllers/authController");
const { verifyToken } = require("../middlewares/auth");

const router = express.Router();


router.post("/register", auth.register);
router.post("/login", auth.login);
router.get("/me", verifyToken, auth.me);
router.put("/me", verifyToken, auth.updateMe);

module.exports = router;

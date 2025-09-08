const express = require("express");
const router = express.Router();
const { createNotification, getNotifications } = require("../controllers/notificationController");
const { verifyToken } = require("../middlewares/auth");
const upload = require("../config/multer");

// Gửi thông báo (clubadmin/superadmin)
router.post("/", verifyToken, upload.single("file"), createNotification);

// Lấy danh sách thông báo (student/clubadmin/superadmin)
router.get("/", verifyToken, getNotifications);

module.exports = router;

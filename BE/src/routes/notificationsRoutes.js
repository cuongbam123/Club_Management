const express = require("express");
const router = express.Router();
const { createNotification, getNotifications, getMyNotifications } = require("../controllers/notificationController");
const { verifyToken } = require("../middlewares/auth");
const upload = require("../config/multer");

// Gửi thông báo (clubadmin/superadmin)
router.post("/", verifyToken, upload.single("file"), createNotification);

// Lấy danh sách thông báo (student/clubadmin/superadmin)
router.get("/", verifyToken, getNotifications);

// User xem thông báo liên quan đến event đã đăng ký
router.get("/my", verifyToken, getMyNotifications);

module.exports = router;

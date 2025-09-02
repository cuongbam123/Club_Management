const router = require("express").Router();
const noti = require("../controllers/notificationController");
const { verifyToken, requireRole } = require("../middlewares/auth");

// tạo thông báo: clubadmin hoặc superadmin
router.post("/", verifyToken, requireRole("clubadmin", "superadmin"), noti.createNotification);
// xem thông báo: user đăng nhập
router.get("/me", verifyToken, noti.listNotifications);

module.exports = router;

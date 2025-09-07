const router = require("express").Router();
const stats = require("../controllers/statisticsController");
const { verifyToken, requireRole } = require("../middlewares/auth");

router.get("/overview", verifyToken, stats.getOverview);

// Thống kê sự kiện (mỗi sự kiện 1 record)
router.get("/events", verifyToken, requireRole("clubadmin", "superadmin"), stats.eventStats);

// Thống kê thành viên theo tuần
router.get("/members-weekly", verifyToken, requireRole("clubadmin", "superadmin"), stats.memberStatsWeekly);


module.exports = router;

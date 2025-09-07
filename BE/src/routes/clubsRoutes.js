const router = require("express").Router();
const clubController = require("../controllers/clubController");
const { verifyToken, requireRole } = require("../middlewares/auth");
const upload = require("../config/multer");

// Cấu hình upload file logo
// const upload = multer({ dest: "uploads/" });

// ======================= CLB =======================
// Tạo CLB (superadmin hoặc clubadmin)
router.post(
  "/",
  verifyToken,
  requireRole("superadmin", "clubadmin"),
  upload.single("logo"),
  clubController.createClub
);

// Lấy logo của CLB theo user hiện tại
router.get("/logo", verifyToken, clubController.getClubLogo);

// Lấy danh sách CLB (public)
router.get("/", clubController.listClubs);

// Lấy chi tiết CLB theo id (public)
router.get("/:id", clubController.getClubDetail);


// Cập nhật CLB
router.put(
  "/:id",
  verifyToken,
  requireRole("superadmin", "clubadmin"),
  upload.single("logo"),
  clubController.updateClub
);

// Xoá CLB
router.delete(
  "/:id",
  verifyToken,
  requireRole("superadmin"),
  clubController.removeClub
);

// ======================= Thành viên CLB =======================
// Lấy danh sách thành viên CLB
router.get(
  "/:id/members",
  verifyToken,
  requireRole("superadmin", "clubadmin"),
  clubController.listMembers
);

// Thêm thành viên vào CLB
router.post(
  "/:id/members",
  verifyToken,
  requireRole("superadmin", "clubadmin"),
  clubController.addMember
);

// Xoá thành viên khỏi CLB
router.delete(
  "/:id/members/:userId",
  verifyToken,
  requireRole("superadmin", "clubadmin"),
  clubController.removeMember
);

module.exports = router;

const router = require("express").Router();
const club = require("../controllers/clubController");
const { verifyToken, requireRole } = require("../middlewares/auth");

// tạo/sửa/xoá: superadmin hoặc clubadmin
router.post("/", verifyToken, requireRole("superadmin", "clubadmin"), club.createClub);
router.get("/", club.listClubs); // public
router.put("/:id", verifyToken, requireRole("superadmin", "clubadmin"), club.updateClub);
router.delete("/:id", verifyToken, requireRole("superadmin"), club.removeClub);

module.exports = router;


//Thiếu chi tiết CLB, thêm thành viên vào clb(gắn clubid), xóa thành viên khỏi clb
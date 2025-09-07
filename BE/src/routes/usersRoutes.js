const router = require("express").Router();
const user = require("../controllers/userController");
const { verifyToken, requireRole, requireSelfOrRole } = require("../middlewares/auth");
const User = require("../models/User");

// ================== LẤY DANH SÁCH CLUB ADMINS ==================
router.get(
  "/clubadmins",
  verifyToken,
  requireRole("superadmin", "clubadmin"),
  async (req, res) => {
    try {
      const admins = await User.find({ role: "clubadmin" }).select("_id name email");
      res.json(admins);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

router.get("/users/me", verifyToken, user.getMe);

// ================== SUPERADMIN QUẢN LÝ USERS ==================
router.get("/admin/users", verifyToken, requireRole("superadmin"), user.listUsers);
router.get("/admin/users/:id", verifyToken, requireSelfOrRole("superadmin"), user.getUser);
router.post("/admin/users", verifyToken, requireRole("superadmin"), user.createUser);
router.put("/admin/users/:id", verifyToken, requireRole("superadmin"), user.updateUser);
router.delete("/admin/users/:id", verifyToken, requireRole("superadmin"), user.removeUser);

module.exports = router;

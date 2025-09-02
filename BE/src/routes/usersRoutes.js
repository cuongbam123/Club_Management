const router = require("express").Router();
const user = require("../controllers/userController");
const { verifyToken, requireRole, requireSelfOrRole } = require("../middlewares/auth");

// superadmin quản lý user
router.get("/", verifyToken, requireRole("superadmin"), user.listUsers);
router.get("/:id", verifyToken, requireSelfOrRole("superadmin"), user.getUser);
router.put("/:id/role", verifyToken, requireRole("superadmin"), user.updateRole);
router.delete("/:id", verifyToken, requireRole("superadmin"), user.removeUser);

module.exports = router;

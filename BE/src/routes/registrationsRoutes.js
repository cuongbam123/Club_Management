const router = require("express").Router();
const reg = require("../controllers/registrationController");
const { verifyToken } = require("../middlewares/auth");

// student đăng ký/hủy; clubadmin/superadmin checkin
router.post("/", verifyToken, reg.createRegistration);
router.get("/me", verifyToken, reg.myRegistrations);
router.delete("/:id", verifyToken, reg.cancelRegistration);
router.post("/:id/checkin", verifyToken, reg.checkin);

module.exports = router;

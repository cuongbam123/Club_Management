const router = require("express").Router();
const event = require("../controllers/eventController");
const { verifyToken, requireRole } = require("../middlewares/auth");
const reg = require("../controllers/registrationController");


// tạo/sửa/xoá: clubadmin (owner) hoặc superadmin
router.post("/", verifyToken, requireRole("clubadmin", "superadmin"), event.createEvent);
router.get("/", event.listEvents); // public
router.get("/:id", event.getEvent); // public
router.put("/:id", verifyToken, event.updateEvent);
router.delete("/:id", verifyToken, event.removeEvent);
router.post("/:id/register", verifyToken, reg.createRegistration);

module.exports = router;


//Thiếu hủy sự kiện
const router = require("express").Router();
const event = require("../controllers/eventController");
const { verifyToken, requireRole } = require("../middlewares/auth");
const updateEventStatus = require("../middlewares/updateEventStatus");
const upload = require("../config/multer");


router.post("/", verifyToken, requireRole("clubadmin", "superadmin"), event.createEvent);
router.get("/", updateEventStatus, event.listEvents);
router.get("/:id", updateEventStatus, event.getEvent);
router.put("/:id", verifyToken, event.updateEvent);
router.delete("/:id", verifyToken, event.removeEvent);
router.patch("/:id/cancel", verifyToken, requireRole("clubadmin", "superadmin"), event.cancelEvent);

// Registration
router.post("/:id/register", verifyToken, event.registerEvent);
router.delete("/:id/register", verifyToken, event.unregisterEvent);

// Check-in & lists
router.post("/:id/checkin", verifyToken, event.checkinEvent);
router.post("/:id/checkin/bulk", verifyToken, requireRole("clubadmin", "superadmin"), event.bulkCheckinEvent);
router.get("/:id/participants", verifyToken, requireRole("clubadmin", "superadmin"), event.listParticipants);
router.get("/:id/attendance", verifyToken, requireRole("clubadmin", "superadmin"), event.listAttendance);

// Upload banner
router.post(
  "/upload-banner",
  verifyToken,
  requireRole("clubadmin", "superadmin"),
  upload.single("banner"),
  event.uploadBanner
);

module.exports = router;

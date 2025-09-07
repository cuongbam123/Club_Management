// middlewares/updateEventStatus.js
const Event = require("../models/Event");

const updateEventStatus = async (req, res, next) => {
  try {
    const now = new Date();

    // Tìm tất cả event chưa kết thúc/hủy
    const events = await Event.find({
      status: { $in: ["upcoming", "ongoing"] },
    });

    for (let e of events) {
      if (e.status === "upcoming" && now >= e.startAt && now < e.endAt) {
        e.status = "ongoing";
        await e.save();
      } else if (
        (e.status === "upcoming" && now >= e.endAt) ||
        (e.status === "ongoing" && now >= e.endAt)
      ) {
        e.status = "finished";
        await e.save();
      }
    }

    next();
  } catch (err) {
    console.error("❌ Error auto-update event status:", err);
    next();
  }
};

module.exports = updateEventStatus;

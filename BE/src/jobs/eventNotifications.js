// src/jobs/eventNotifications.js
const cron = require("node-cron");
const dayjs = require("dayjs");
const Event = require("../models/Event");
const Notification = require("../models/Notification");

// Hàm gửi thông báo
async function sendNotification({ title, content, eventId }) {
  try {
    await Notification.create({
      title,
      content,
      eventId,
      receiverType: "all",
      sender: "System",
    });
    console.log("🔔 Notification:", title);
  } catch (err) {
    console.error("❌ Error sending notification:", err.message);
  }
}

// Cronjob chạy mỗi phút
cron.schedule("* * * * *", async () => {
  try {
    const now = dayjs();

    // chỉ lấy sự kiện chưa kết thúc/hủy
    const events = await Event.find({
      status: { $in: ["upcoming", "ongoing"] },
    });

    for (const ev of events) {
      const start = dayjs(ev.startAt);
      const end = dayjs(ev.endAt);

      // 15 phút trước khi bắt đầu
      if (
        ev.status === "upcoming" &&
        !ev.notified15mBefore &&
        now.isSame(start.subtract(2, "minute"), "minute")
      ) {
        await sendNotification({
          title: `Sắp diễn ra: ${ev.title}`,
          content: `Sự kiện ${ev.title} sẽ bắt đầu lúc ${start.format("HH:mm DD/MM/YYYY")}`,
          eventId: ev._id,
        });
        ev.notified15mBefore = true;
        await ev.save();
      }

      // Bắt đầu sự kiện
      if (
        ev.status === "upcoming" &&
        !ev.notifiedStart &&
        now.isSame(start, "minute")
      ) {
        await sendNotification({
          title: `Bắt đầu sự kiện: ${ev.title}`,
          content: `Sự kiện ${ev.title} đã bắt đầu!`,
          eventId: ev._id,
        });
        ev.status = "ongoing";
        ev.notifiedStart = true;
        await ev.save();
      }

      // Kết thúc sự kiện
      if (
        ev.status === "ongoing" &&
        !ev.notifiedEnd &&
        now.isSame(end, "minute")
      ) {
        await sendNotification({
          title: `Kết thúc sự kiện: ${ev.title}`,
          content: `Sự kiện ${ev.title} đã kết thúc.`,
          eventId: ev._id,
        });
        ev.status = "finished";
        ev.notifiedEnd = true;
        await ev.save();
      }
    }
  } catch (err) {
    console.error("❌ Cronjob error:", err.message);
  }
});

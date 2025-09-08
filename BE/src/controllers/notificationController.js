const Notification = require("../models/Notification");
const Event = require("../models/Event");

// [POST] /api/notifications
const createNotification = async (req, res) => {
  try {
    const { title, content, receiverType, eventId } = req.body;
    let file = null;

    if (req.file) {
      file = `${req.protocol}://${req.get("host")}/api/uploads/${req.file.filename}`;
    }

    const noti = await Notification.create({
      title,
      content,
      receiverType: receiverType || "all",
      eventId: eventId || null,
      file,
      sender: req.user?.name || "System",
    });

    res.status(201).json(noti);
  } catch (err) {
    console.error("Error createNotification:", err);
    res.status(500).json({ message: err.message });
  }
};


// [GET] /api/notifications
const getNotifications = async (req, res) => {
  try {
    const notis = await Notification.find({})
      .sort({ createdAt: -1 })
      .limit(50); // giới hạn cho nhẹ
    res.json(notis);
  } catch (err) {
    console.error("Error getNotifications:", err);
    res.status(500).json({ message: err.message });
  }
};

// [GET] /api/notifications/my  (user xem thông báo sự kiện đã đăng ký)
const getMyNotifications = async (req, res) => {
  try {
    // Lấy tất cả event user đã đăng ký
    const events = await Event.find({ participants: req.user._id }).select("_id");

    const notis = await Notification.find({
      eventId: { $in: events.map((e) => e._id) },
    })
      .sort({ createdAt: -1 })
      .limit(50);

    res.json(notis);
  } catch (err) {
    console.error("Error getMyNotifications:", err);
    res.status(500).json({ message: err.message });
  }
};

module.exports = { createNotification, getNotifications, getMyNotifications };

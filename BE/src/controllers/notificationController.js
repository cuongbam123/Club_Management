const Notification = require("../models/Notification");

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

module.exports = { createNotification, getNotifications };

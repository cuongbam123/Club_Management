const Notification = require("../models/Notification");

const createNotification = async (req, res) => {
  try {
    const { eventId, message, recipients } = req.body;
    const n = await Notification.create({ eventId, message, recipients });
    res.status(201).json(n);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const listNotifications = async (req, res) => {
  try {
    const list = await Notification.find({ recipients: req.user._id }).sort({ createdAt: -1 });
    res.json(list);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { createNotification, listNotifications };

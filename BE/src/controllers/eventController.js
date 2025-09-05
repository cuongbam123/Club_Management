const Event = require("../models/Event");
const Notification = require("../models/Notification");

// Tạo sự kiện mới
const createEvent = async (req, res) => {
  try {
    const {
      title,
      description,
      location,
      startAt,
      endAt,
      capacity,
      bannerUrl,
      cancelDeadline,
      clubId,
    } = req.body;

    const event = await Event.create({
      title,
      description,
      location,
      startAt,
      endAt,
      capacity,
      bannerUrl,
      cancelDeadline,
      clubId,
      createdBy: req.user._id,
    });

    res.status(201).json(event);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Lấy danh sách sự kiện (có thể lọc theo status)
const listEvents = async (req, res) => {
  try {
    const q = {};
    if (req.query.status) q.status = req.query.status;

    const events = await Event.find(q)
      .populate("clubId", "name")
      .populate("createdBy", "name email");

    res.json(events);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Chi tiết 1 sự kiện
const getEvent = async (req, res) => {
  try {
    const e = await Event.findById(req.params.id)
      .populate("clubId", "name")
      .populate("createdBy", "name");

    if (!e) return res.status(404).json({ message: "Event not found" });
    res.json(e);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Cập nhật sự kiện (chỉ owner hoặc superadmin)
const updateEvent = async (req, res) => {
  try {
    const e = await Event.findById(req.params.id);
    if (!e) return res.status(404).json({ message: "Event not found" });

    if (
      req.user.role !== "superadmin" &&
      e.createdBy.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const updated = await Event.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Xóa sự kiện
const removeEvent = async (req, res) => {
  try {
    const e = await Event.findById(req.params.id);
    if (!e) return res.status(404).json({ message: "Event not found" });

    if (
      req.user.role !== "superadmin" &&
      e.createdBy.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: "Forbidden" });
    }

    await e.deleteOne();
    res.json({ message: "Event deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Đăng ký tham gia sự kiện
const registerEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });

    if (event.participants.includes(req.user._id)) {
      return res.status(400).json({ message: "Bạn đã đăng ký rồi" });
    }

    if (event.participants.length >= event.capacity) {
      return res.status(400).json({ message: "Sự kiện đã đủ chỗ" });
    }

    event.participants.push(req.user._id);
    await event.save();

    // Gửi thông báo sau khi đăng ký thành công
    await Notification.create({
      eventId: event._id,
      message: `Bạn đã đăng ký thành công sự kiện "${event.title}"`,
      recipients: [req.user._id],
    });

    res.json({ message: "Đăng ký thành công", event });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Hủy đăng ký sự kiện
const unregisterEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });

    event.participants = event.participants.filter(
      (p) => p.toString() !== req.user._id.toString()
    );
    await event.save();

    res.json({ message: "Hủy đăng ký thành công" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  createEvent,
  listEvents,
  getEvent,
  updateEvent,
  removeEvent,
  registerEvent,
  unregisterEvent,
};

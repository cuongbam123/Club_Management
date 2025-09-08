const Event = require("../models/Event");
const Notification = require("../models/Notification");
const Registration = require("../models/Registration");


// Tạo sự kiện
const createEvent = async (req, res) => {
  try {
    const event = await Event.create({
      ...req.body,
      createdBy: req.user._id,
    });
    res.status(201).json(event);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Lấy danh sách sự kiện
const listEvents = async (req, res) => {
  try {
    const q = {};
    if (req.query.status) q.status = req.query.status;

    const events = await Event.find(q)
      .populate("clubId", "name")
      .populate("createdBy", "name email");

    // Trả về kèm participantsCount và attendedCount
    const formatted = events.map(e => ({
      ...e.toObject(),
      participantsCount: e.participants?.length || 0,
      attendedCount: e.attended?.length || 0,
    }));

    res.json(formatted);
  } catch (err) {
    console.error("Error listEvents:", err);
    res.status(500).json({ message: err.message });
  }
};


// Chi tiết sự kiện
const getEvent = async (req, res) => {
  try {
    const e = await Event.findById(req.params.id)
      .populate("clubId", "name")
      .populate("createdBy", "name email")
      .populate("participants", "name email")
      .populate("attended", "name email");

    if (!e) return res.status(404).json({ message: "Event not found" });

    res.json({
      ...e.toObject(),
      participantsCount: e.participants?.length || 0,
      attendedCount: e.attended?.length || 0,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Cập nhật sự kiện
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

    const { status } = req.body;
    if (status && status !== e.status) {
      if (e.status === "upcoming" && status !== "cancelled") {
        return res
          .status(400)
          .json({ message: "Upcoming chỉ có thể đổi sang Cancelled" });
      }
      if (e.status === "ongoing" && status !== "finished") {
        return res
          .status(400)
          .json({ message: "Ongoing chỉ có thể đổi sang Finished" });
      }
      if (["finished", "cancelled"].includes(e.status)) {
        return res
          .status(400)
          .json({ message: "Event đã kết thúc/hủy không thể đổi trạng thái" });
      }
    }

    Object.assign(e, req.body);
    await e.save();

    res.json(e);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Hủy sự kiện
const cancelEvent = async (req, res) => {
  try {
    const e = await Event.findById(req.params.id);
    if (!e) return res.status(404).json({ message: "Event not found" });

    e.status = "cancelled";
    await e.save();

    // 🔔 Gửi thông báo khi hủy sự kiện
    await Notification.create({
      title: `Hủy sự kiện: ${e.title}`,
      content: `Sự kiện "${e.title}" đã bị hủy.`,
      eventId: e._id,
      receiverType: "all",
      sender: "System",
    });

    res.json({ message: "Event cancelled and notification sent", event: e });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// Xóa sự kiện
const removeEvent = async (req, res) => {
  try {
    const e = await Event.findById(req.params.id);
    if (!e) return res.status(404).json({ message: "Event not found" });

    await e.deleteOne();
    res.json({ message: "Event deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Đăng ký
const registerEvent = async (req, res) => {
  try {
    const e = await Event.findById(req.params.id);
    if (!e) return res.status(404).json({ message: "Event not found" });

    if (e.status !== "upcoming") {
      return res.status(400).json({ message: "Event is not open for registration" });
    }

    if (e.cancelDeadline && new Date() > e.cancelDeadline) {
      return res.status(400).json({ message: "Registration deadline passed" });
    }

    if (e.participants.includes(req.user._id)) {
      return res.status(400).json({ message: "Already registered" });
    }

    if (e.capacity && e.participants.length >= e.capacity) {
      return res.status(400).json({ message: "Event is full" });
    }

    e.participants.push(req.user._id);
    await e.save();

    // 🔽 thêm bản ghi vào registrations để đồng bộ
    await Registration.findOneAndUpdate(
      { eventId: e._id, userId: req.user._id },
      { status: "registered" },
      { upsert: true, new: true }
    );

    res.json({ message: "Registered successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Hủy đăng ký
const unregisterEvent = async (req, res) => {
  try {
    const e = await Event.findById(req.params.id);
    if (!e) return res.status(404).json({ message: "Event not found" });

    if (e.cancelDeadline && new Date() > e.cancelDeadline) {
      return res.status(400).json({ message: "Cannot unregister after deadline" });
    }

    e.participants = e.participants.filter(
      (p) => p.toString() !== req.user._id.toString()
    );
    await e.save();

    // 🔽 cập nhật registration thành cancelled
    await Registration.findOneAndUpdate(
      { eventId: e._id, userId: req.user._id },
      { status: "cancelled" }
    );

    res.json({ message: "Unregistered successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Check-in
const checkinEvent = async (req, res) => {
  try {
    const e = await Event.findById(req.params.id);
    if (!e) return res.status(404).json({ message: "Event not found" });

    if (e.status !== "ongoing") {
      return res.status(400).json({ message: "Event is not ongoing" });
    }

    const userId = req.body.userId || req.user._id;

    if (!e.participants.includes(userId)) {
      return res.status(400).json({ message: "User not registered" });
    }

    if (!e.attended.includes(userId)) {
      e.attended.push(userId);
      await e.save();
    }

    res.json({ message: "Checked in successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//Checkin nhiều người
const bulkCheckinEvent = async (req, res) => {
  try {
    const { userIds } = req.body; // mảng userId
    const e = await Event.findById(req.params.id);
    if (!e) return res.status(404).json({ message: "Event not found" });

    if (e.status !== "ongoing") {
      return res.status(400).json({ message: "Event is not ongoing" });
    }

    // Lọc ra những user đã đăng ký
    const validUsers = userIds.filter(u =>
      e.participants.map(p => p.toString()).includes(u.toString())
    );

    // Add vào attended nếu chưa có
    validUsers.forEach(u => {
      if (!e.attended.map(a => a.toString()).includes(u.toString())) {
        e.attended.push(u);
      }
    });

    await e.save();

    res.json({
      message: "Bulk check-in thành công",
      attendedCount: e.attended.length,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Danh sách participants
const listParticipants = async (req, res) => {
  try {
    const e = await Event.findById(req.params.id)
      .populate("participants", "name email");

    if (!e) return res.status(404).json({ message: "Event not found" });
    res.json(e.participants);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Danh sách attendance
const listAttendance = async (req, res) => {
  try {
    const e = await Event.findById(req.params.id)
      .populate("attended", "name email");

    if (!e) return res.status(404).json({ message: "Event not found" });
    res.json(e.attended);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Upload banner
const uploadBanner = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });
    const bannerUrl = `/api/uploads/${req.file.filename}`;
    res.json({ bannerUrl });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  createEvent,
  listEvents,
  getEvent,
  updateEvent,
  cancelEvent,
  removeEvent,
  registerEvent,
  unregisterEvent,
  checkinEvent,
  bulkCheckinEvent,
  listParticipants,
  listAttendance,
  uploadBanner,
};

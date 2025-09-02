const Registration = require("../models/Registration");
const Event = require("../models/Event");

const createRegistration = async (req, res) => {
  try {
    const { eventId } = req.body;
    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: "Event not found" });

    if (event.capacity && event.participantsCount >= event.capacity) {
      return res.status(400).json({ message: "Event is full" });
    }
    if (event.cancelDeadline && new Date() > new Date(event.endAt)) {
      return res.status(400).json({ message: "Event already finished" });
    }

    const reg = await Registration.create({ eventId, userId: req.user._id });
    await Event.findByIdAndUpdate(eventId, { $inc: { participantsCount: 1 } });
    res.status(201).json(reg);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: "Already registered" });
    }
    res.status(500).json({ message: err.message });
  }
};

const myRegistrations = async (req, res) => {
  try {
    const regs = await Registration.find({ userId: req.user._id })
      .populate("eventId", "title startAt endAt location");
    res.json(regs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const cancelRegistration = async (req, res) => {
  try {
    const reg = await Registration.findById(req.params.id);
    if (!reg) return res.status(404).json({ message: "Registration not found" });
    if (reg.userId.toString() !== req.user._id.toString() && req.user.role === "student") {
      return res.status(403).json({ message: "Forbidden" });
    }

    const event = await Event.findById(reg.eventId);
    if (event.cancelDeadline && new Date() > new Date(event.cancelDeadline)) {
      return res.status(400).json({ message: "Cancel deadline passed" });
    }

    if (reg.status === "registered") {
      await Event.findByIdAndUpdate(reg.eventId, { $inc: { participantsCount: -1 } });
    }
    reg.status = "cancelled";
    await reg.save();
    res.json({ message: "Registration cancelled" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const checkin = async (req, res) => {
  try {
    // chỉ clubadmin hoặc superadmin check-in
    if (!["clubadmin", "superadmin"].includes(req.user.role)) {
      return res.status(403).json({ message: "Forbidden" });
    }
    const reg = await Registration.findById(req.params.id);
    if (!reg) return res.status(404).json({ message: "Registration not found" });

    reg.status = "attended";
    reg.checkedInAt = new Date();
    await reg.save();
    await Event.findByIdAndUpdate(reg.eventId, { $inc: { attendedCount: 1 } });
    res.json({ message: "Checked in", reg });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { createRegistration, myRegistrations, cancelRegistration, checkin };

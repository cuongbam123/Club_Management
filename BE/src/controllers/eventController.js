const Event = require("../models/Event");

const createEvent = async (req, res) => {
  try {
    const { title, description, location, startAt, endAt, capacity, bannerUrl, cancelDeadline, clubId } = req.body;
    const event = await Event.create({
      title, description, location, startAt, endAt, capacity, bannerUrl, cancelDeadline,
      clubId, createdBy: req.user._id
    });
    res.status(201).json(event);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const listEvents = async (req, res) => {
  try {
    const q = {};
    if (req.query.status) q.status = req.query.status;
    const events = await Event.find(q).populate("clubId", "name").populate("createdBy", "name email");
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getEvent = async (req, res) => {
  try {
    const e = await Event.findById(req.params.id).populate("clubId", "name").populate("createdBy", "name");
    if (!e) return res.status(404).json({ message: "Event not found" });
    res.json(e);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateEvent = async (req, res) => {
  try {
    const e = await Event.findById(req.params.id);
    if (!e) return res.status(404).json({ message: "Event not found" });

    // chỉ cho owner (createdBy) hoặc superadmin
    if (req.user.role !== "superadmin" && e.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Forbidden" });
    }
    const updated = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const removeEvent = async (req, res) => {
  try {
    const e = await Event.findById(req.params.id);
    if (!e) return res.status(404).json({ message: "Event not found" });
    if (req.user.role !== "superadmin" && e.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Forbidden" });
    }
    await e.deleteOne();
    res.json({ message: "Event deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { createEvent, listEvents, getEvent, updateEvent, removeEvent };

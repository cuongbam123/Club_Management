const Club = require("../models/Club");
const User = require("../models/User");

const createClub = async (req, res) => {
  try {
    const { name, description, logoUrl, president } = req.body;
    if (president) {
      const p = await User.findById(president);
      if (!p) return res.status(400).json({ message: "President not found" });
      if (p.role !== "clubadmin") return res.status(400).json({ message: "President must be clubadmin" });
    }
    const club = await Club.create({ name, description, logoUrl, president });
    res.status(201).json(club);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const listClubs = async (req, res) => {
  try {
    const clubs = await Club.find().populate("president", "name email role");
    res.json(clubs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateClub = async (req, res) => {
  try {
    const data = req.body;
    if (data.president) {
      const p = await User.findById(data.president);
      if (!p) return res.status(400).json({ message: "President not found" });
      if (p.role !== "clubadmin") return res.status(400).json({ message: "President must be clubadmin" });
    }
    const club = await Club.findByIdAndUpdate(req.params.id, data, { new: true });
    if (!club) return res.status(404).json({ message: "Club not found" });
    res.json(club);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const removeClub = async (req, res) => {
  try {
    await Club.findByIdAndDelete(req.params.id);
    res.json({ message: "Club deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { createClub, listClubs, updateClub, removeClub };

const Club = require("../models/Club");
const User = require("../models/User");

// ======================= Tạo CLB =======================
const createClub = async (req, res) => {
  try {
    const { name, description, president } = req.body;
    let logoUrl = req.body.logoUrl;

    if (req.file) {
      logoUrl = `/uploads/${req.file.filename}`;
    }

    // Kiểm tra president
    if (president) {
      const p = await User.findById(president);
      if (!p) return res.status(400).json({ message: "President not found" });
      if (p.role !== "clubadmin") {
        return res.status(400).json({ message: "President must be clubadmin" });
      }
    }

    const club = await Club.create({ name, description, logoUrl, president });
    res.status(201).json(club);
  } catch (err) {
    console.error("Error createClub:", err);
    res.status(500).json({ message: err.message });
  }
};

// ======================= Lấy danh sách CLB =======================
const listClubs = async (req, res) => {
  try {
    const clubs = await Club.find().populate("president", "name email role");
    res.json(clubs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ======================= Chi tiết CLB =======================
const getClubDetail = async (req, res) => {
  try {
    const club = await Club.findById(req.params.id)
      .populate("president", "name email role")
      .lean();

    if (!club) return res.status(404).json({ message: "Club not found" });

    // Lấy danh sách thành viên
    const members = await User.find({ clubId: club._id })
      .select("name email role")
      .lean();

    res.json({ ...club, members });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ======================= Cập nhật CLB =======================
const updateClub = async (req, res) => {
  try {
    const { name, description, president } = req.body;
    let updateData = { name, description, president };

    if (req.file) {
      updateData.logoUrl = `/uploads/${req.file.filename}`;
    }

    if (president) {
      const p = await User.findById(president);
      if (!p) return res.status(400).json({ message: "President not found" });
      if (p.role !== "clubadmin") {
        return res.status(400).json({ message: "President must be clubadmin" });
      }
    }

    const club = await Club.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    });

    if (!club) return res.status(404).json({ message: "Club not found" });
    res.json(club);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ======================= Xoá CLB =======================
const removeClub = async (req, res) => {
  try {
    await Club.findByIdAndDelete(req.params.id);
    res.json({ message: "Club deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ======================= Thêm thành viên vào CLB =======================
const addMember = async (req, res) => {
  try {
    const { userId } = req.body;
    const clubId = req.params.id;

    const club = await Club.findById(clubId);
    if (!club) return res.status(404).json({ message: "Club not found" });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.clubId = clubId;
    await user.save();

    res.json({ message: "Member added to club", user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ======================= Xoá thành viên khỏi CLB =======================
const removeMember = async (req, res) => {
  try {
    const { id, userId } = req.params;

    const club = await Club.findById(id);
    if (!club) return res.status(404).json({ message: "Club not found" });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.clubId?.toString() !== id) {
      return res.status(400).json({ message: "User is not in this club" });
    }

    user.clubId = null;
    await user.save();

    res.json({ message: "Member removed from club" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ======================= Lấy danh sách thành viên CLB =======================
const listMembers = async (req, res) => {
  try {
    const club = await Club.findById(req.params.id);
    if (!club) return res.status(404).json({ message: "Club not found" });

    const members = await User.find({ clubId: club._id })
      .select("name email role")
      .lean();

    res.json(members);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  createClub,
  listClubs,
  getClubDetail,
  updateClub,
  removeClub,
  addMember,
  removeMember,
  listMembers,
};

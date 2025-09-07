const User = require("../models/User");

// ================== LẤY TẤT CẢ USERS ==================
const listUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password").populate("clubId", "name");
    const formatted = users.map(u => ({
      ...u.toObject(),
      clubName: u.clubId ? u.clubId.name : null,
    }));
    res.json(formatted);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ================== LẤY 1 USER ==================
const getUser = async (req, res) => {
  try {
    const u = await User.findById(req.params.id).select("-password").populate("clubId", "name");
    if (!u) return res.status(404).json({ message: "User not found" });
    res.json({
      ...u.toObject(),
      clubName: u.clubId ? u.clubId.name : null,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ================== TẠO USER MỚI ==================
// controllers/userController.js
const createUser = async (req, res) => {
  try {
    const { name, email, password, phone, address, clubId, role } = req.body;

    // Chỉ check name, email, password là bắt buộc
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Thiếu thông tin bắt buộc" });
    }

    const userData = {
      name,
      email,
      password, // TODO: hash password trước khi lưu
      phone,
      address,
      role,
    };

    // Nếu có clubId thì mới thêm
    if (clubId) {
      userData.clubId = clubId;
    }

    const newUser = await User.create(userData);
    res.status(201).json(newUser);
  } catch (err) {
    console.error("Lỗi createUser:", err);
    res.status(500).json({ message: err.message });
  }
};


// ================== CẬP NHẬT USER ==================
const updateUser = async (req, res) => {
  try {
    const { name, email, phone, address, clubId, role, password } = req.body;

    const updateData = { name, email, phone, address, role };

    if (clubId === "") {
      updateData.clubId = null;   // cho phép bỏ CLB
    } else if (clubId) {
      updateData.clubId = clubId; // gán CLB mới
    }

    if (password) updateData.password = password;

    const u = await User.findByIdAndUpdate(req.params.id, updateData, { new: true })
      .select("-password")
      .populate("clubId", "name");

    if (!u) return res.status(404).json({ message: "User not found" });

    res.json({
      ...u.toObject(),
      clubName: u.clubId ? u.clubId.name : null,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// ================== CHỈ ĐỔI ROLE ==================
const updateRole = async (req, res) => {
  try {
    const { role } = req.body;
    const u = await User.findByIdAndUpdate(req.params.id, { role }, { new: true })
      .select("-password");
    res.json(u);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ================== XOÁ USER ==================
const removeUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  listUsers,
  getUser,
  createUser,
  updateUser,
  updateRole,
  removeUser,
};

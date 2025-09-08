const User = require("../models/User");
const Club = require("../models/Club");
const bcrypt = require("bcryptjs");

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
const createUser = async (req, res) => {
  try {
    const { name, email, password, phone, address, clubId, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Thiếu thông tin bắt buộc" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const userData = {
      name,
      email,
      password: hashedPassword,
      phone,
      address,
      role,
    };

    if (clubId) {
      userData.clubId = clubId;
      userData.joinedAt = new Date();
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

    if (password) {
      updateData.password = await bcrypt.hash(password, 10); // hash lại nếu đổi mật khẩu
    }

    if (clubId) {
      updateData.clubId = clubId;
      updateData.joinedAt = new Date();
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "Không tìm thấy user" });
    }

    res.json(updatedUser);
  } catch (err) {
    console.error("Lỗi updateUser:", err);
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

// Lấy user hiện tại từ token
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id) // 👈 dùng _id thay vì id
      .select("-password")
      .populate("clubId", "name logoUrl");

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
       avatarUrl: user.avatarUrl || null,
      clubName: user.clubId ? user.clubId.name : null,
      clubLogo: user.clubId ? user.clubId.logoUrl : null,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// [POST] /api/users/upload-avatar
const uploadAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.avatarUrl = `/api/uploads/${req.file.filename}`;
    await user.save();

    res.json({ message: "Avatar updated", avatarUrl: user.avatarUrl });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateMe = async (req, res) => {
  try {
    const updates = (({ name, email, phone, address }) => ({ name, email, phone, address }))(req.body);
    const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true }).select("-password");
    res.json(user);
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
  getMe,
  uploadAvatar,
  updateMe,
};

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// ================== ĐĂNG KÝ ==================
const register = async (req, res) => {
  try {
    const { name, email, password, phone, address, role, clubId } = req.body;

    // Check email tồn tại
    const existed = await User.findOne({ email });
    if (existed) return res.status(400).json({ message: "Email already exists" });

    // Hash password
    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashed,
      phone,
      address,
      role,
      clubId,
    });

    res.status(201).json({
      message: "Registered successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ message: err.message });
  }
};

// ================== ĐĂNG NHẬP ==================
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).populate("clubId", "name logoUrl");
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        clubId: user.clubId ? user.clubId._id : null,
        clubName: user.clubId ? user.clubId.name : null,
        clubLogo: user.clubId ? user.clubId.logoUrl : null,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: err.message });
  }
};

// ================== LẤY THÔNG TIN USER HIỆN TẠI ==================
const me = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select("-password")
      .populate("clubId", "name logoUrl");

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        clubId: user.clubId ? user.clubId._id : null,
        clubName: user.clubId ? user.clubId.name : null,
        clubLogo: user.clubId ? user.clubId.logoUrl : null,
      },
    });
  } catch (err) {
    console.error("Me error:", err);
    res.status(500).json({ message: err.message });
  }
};

// ================== UPDATE USER HIỆN TẠI ==================
const updateMe = async (req, res) => {
  try {
    const { name, phone, address, password } = req.body;

    const update = {};
    if (name !== undefined) update.name = name;
    if (phone !== undefined) update.phone = phone;
    if (address !== undefined) update.address = address;
    if (password) update.password = await bcrypt.hash(password, 10);

    const user = await User.findByIdAndUpdate(req.user._id, update, {
      new: true,
    }).select("-password");

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (err) {
    console.error("UpdateMe error:", err);
    res.status(500).json({ message: err.message });
  }
};

//Quên mk

const forgotPassword = async (req, res) => {
  try {
    const { email, phone, newPassword } = req.body;

    if (!email || !phone || !newPassword) {
      return res
        .status(400)
        .json({ message: "Email, phone và newPassword là bắt buộc" });
    }

    // Tìm user theo email + phone
    const user = await User.findOne({ email, phone });
    if (!user) {
      return res
        .status(400)
        .json({ message: "Email hoặc số điện thoại không đúng" });
    }

    // Hash mật khẩu mới
    const hashed = await bcrypt.hash(newPassword, 10);
    user.password = hashed;
    await user.save();

    res.json({ message: "Cập nhật mật khẩu thành công" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


module.exports = { register, login, me, updateMe, forgotPassword };

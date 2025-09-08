const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String },
  address: { type: String },
  avatarUrl: { type: String, default: "" },
  role: {
    type: String,
    enum: ["superadmin", "clubadmin", "student"],
    default: "student",
  },
  clubId: { type: mongoose.Schema.Types.ObjectId, ref: "Club" },
  joinedAt: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);

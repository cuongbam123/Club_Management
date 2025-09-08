const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  location: String,
  startAt: { type: Date, required: true },
  endAt: { type: Date, required: true },
  capacity: Number,
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // ai đã đăng ký
  attended: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // ai đã checkin
  bannerUrl: String,
  cancelDeadline: Date,
  status: {
    type: String,
    enum: ["upcoming", "ongoing", "finished", "cancelled"],
    default: "upcoming",
  },

  //cronjob
  notified15mBefore: { type: Boolean, default: false },
  notifiedStart: { type: Boolean, default: false },
  notifiedEnd: { type: Boolean, default: false },

  clubId: { type: mongoose.Schema.Types.ObjectId, ref: "Club", required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
}, { timestamps: true });

module.exports = mongoose.model("Event", eventSchema);

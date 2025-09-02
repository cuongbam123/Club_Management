const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  location: String,
  startAt: { type: Date, required: true },
  endAt: { type: Date, required: true },
  capacity: Number,
  participantsCount: { type: Number, default: 0 },
  attendedCount: { type: Number, default: 0 },
  bannerUrl: String,
  cancelDeadline: { type: Date },
  status: {
    type: String,
    enum: ["upcoming", "ongoing", "finished", "cancelled"],
    default: "upcoming",
  },
  clubId: { type: mongoose.Schema.Types.ObjectId, ref: "Club", required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
}, { timestamps: true });

module.exports = mongoose.model("Event", eventSchema);

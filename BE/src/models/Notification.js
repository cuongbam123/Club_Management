// const mongoose = require("mongoose");

// const notificationSchema = new mongoose.Schema({
//   eventId: { type: mongoose.Schema.Types.ObjectId, ref: "Event" },
//   message: { type: String, required: true },
//   recipients: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
//   sentAt: { type: Date, default: Date.now },
// }, { timestamps: true });

// module.exports = mongoose.model("Notification", notificationSchema);

const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    file: { type: String },
    receiverType: {
      type: String,
      enum: ["all", "attended", "not_attended"],
      default: "all",
    },
    eventId: { type: mongoose.Schema.Types.ObjectId, ref: "Event" },
    readers: { type: Number, default: 0 },
    sender: { type: String, default: "System" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Notification", notificationSchema);

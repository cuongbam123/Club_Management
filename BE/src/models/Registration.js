const mongoose = require("mongoose");

const registrationSchema = new mongoose.Schema({
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: "Event", required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  status: {
    type: String,
    enum: ["registered", "attended", "cancelled"],
    default: "registered",
  },
  registeredAt: { type: Date, default: Date.now },
  checkedInAt: { type: Date },
}, { timestamps: true });

registrationSchema.index({ eventId: 1, userId: 1 }, { unique: true });

module.exports = mongoose.model("Registration", registrationSchema);

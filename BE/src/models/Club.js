const mongoose = require("mongoose");

const clubSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  logoUrl: String,
  president: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // clubadmin
}, { timestamps: true });

module.exports = mongoose.model("Club", clubSchema);

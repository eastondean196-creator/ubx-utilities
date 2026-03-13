const mongoose = require("mongoose");

const linkSchema = new mongoose.Schema({
url: { type: String, required: true },
type: { type: String, default: "full" }, // "full" or "lite"
used: { type: Boolean, default: false },
claimedBy: { type: String },
claimedAt: { type: Number }
});

module.exports = mongoose.model("Links", linkSchema);

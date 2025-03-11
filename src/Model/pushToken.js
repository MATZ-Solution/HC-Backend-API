const mongoose = require("mongoose");

const pushTokenSchema = new mongoose.Schema({
  expoPushToken: { type: String, required: true, unique: true },
});

module.exports = mongoose.model("PushToken", pushTokenSchema);
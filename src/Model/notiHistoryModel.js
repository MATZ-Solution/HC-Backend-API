const mongoose = require("mongoose");

// Define the Mongoose schema for the advisor
const notiHistorySchema = new mongoose.Schema({
  title: {
    type: String,
  },
  Notification: {
    type: String,
  },
  lastName: {
    type: String,
  },
  advisorEmail: {
    type: String,
  },
  advisorContactNo: {
    type: Number,
  },
  advisorAddress: {
    type: String,
  },
  superAdminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "superAdmin",
  },
});

// Create the Mongoose model
const Notification = mongoose.model("NotificationHistory", notiHistorySchema);

module.exports = Notification;

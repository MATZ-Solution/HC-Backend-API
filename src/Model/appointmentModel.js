const mongoose = require("mongoose");

const appointmentSchema = mongoose.Schema(
  {
    eventDate: {
      type: String,
    },
    beginTime: {
      type: String,
    },
    endTime: {
      type: String,
    },
    description: {
      type: String,
    },
    isApprovedBySuperAdmin: {
      type: Boolean,
      default: false,
    },
    isApprovedByDoctor: {
      type: Boolean,
      default: false,
    },
    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "services",
    },
    patId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    appointmentStatus: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AppointmentStatus",
    },
    otherCare: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "otherCare",
    },
  },
  { timestamps: true }
);

const Appointment = mongoose.model("Appointment", appointmentSchema);

module.exports = Appointment;

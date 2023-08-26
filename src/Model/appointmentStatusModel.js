const mongoose = require("mongoose");

const appointmentStatusSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    legendColor: {
      type: String,
    },
    sortOrder: {
      type: Number,
    },
    descriptionText: {
      type: String,
    },
    statusKey: {
      type: String,
    },
    forOtherCare: {
      type: Boolean,
      default: false,
    },
    forSeniorCare: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const AppointmentStatus = mongoose.model(
  "AppointmentStatus",
  appointmentStatusSchema
);

module.exports = AppointmentStatus;

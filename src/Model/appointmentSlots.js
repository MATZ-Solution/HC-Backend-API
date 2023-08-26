const mongoose = require("mongoose");

const appointmentSlotsSchema = mongoose.Schema(
  {
    selectStartDateandTime: {
      type: String,
    },
    selectEndDateAndTime: {
      type: String,
    },
    serviceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
    },
    patId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient", // Replace "Patient" with the name of the patient model you have
    },
    otherCareId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "OtherCare", // Replace "OtherCare" with the name of the otherCare model you have
    },
  },
  { timestamps: true }
);

const appointmentSlots = mongoose.model("appointmentSlots", appointmentSlotsSchema);

module.exports = appointmentSlots;

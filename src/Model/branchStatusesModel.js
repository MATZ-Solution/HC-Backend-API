const mongoose = require("mongoose");

const branchappointmentStatusSchema = mongoose.Schema(
  {
    title: {
      type: String},
    legendColor: {
      type: String,
    },
    sortOrder: {
      type: Number
    },
    descriptionText: {
      type: String,
    },
    statusKey: {
      type: String,
    },
    appointmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BranchRequest",
    },
  },
  { timestamps: true }
);

const branchAppointmentStatus = mongoose.model(
  "branchAppointmentStatus",
  branchappointmentStatusSchema
);

module.exports = branchAppointmentStatus;

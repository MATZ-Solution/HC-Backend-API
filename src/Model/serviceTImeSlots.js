const mongoose = require("mongoose");

const servicesTimeSlotsSchema = mongoose.Schema(
  {
    // Your existing fields
    buisnessDay: {
      type: String,
    },
    startTime: {
      type: String,
    },
    endTime: {
      type: String,
    },
    isClosed: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const servicesTimeSlotsArraySchema = mongoose.Schema({
  // Define the array of time slots using the previous schema
  timeSlots: [servicesTimeSlotsSchema],
  otherCareId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "otherCare",
  },
});

const servicesTimeSlotsArray = mongoose.model(
  "servicesTimeSlotsArray",
  servicesTimeSlotsArraySchema
);

module.exports = servicesTimeSlotsArray;

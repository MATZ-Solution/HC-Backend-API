const mongoose = require("mongoose");

const VitalSchema = new mongoose.Schema(
  {
    heartRatePulse: {
      type: String
    },
    bloodPressure: {
      type: String
    },
    respiratoryRate: {
      type: String
    },
    bodyTemperature: {
      type: String
    },
    bloodOxygen: {
      type: String
    },
    bodyWeight: {
      type: String
    },
    bodyGlucoseLevel: {
      type: String
    },
    medicalReports: {
      type: String
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Vital", VitalSchema);

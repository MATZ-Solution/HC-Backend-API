const mongoose = require("mongoose");

const servicesSchema = mongoose.Schema(
  {
    servicesType: {
      type: String,
    },
    serviceDetail: {
      type: String,
    },
    serviceCharges: {
      type: String,
    },
    isApprovedbySuperAdmin: {
      type: Boolean,
      default: false,
    },
    openingWorkHours: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "servicesTimeSlotsArray",
    },
    otherCareId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "otherCare",
    },
  },
  { timestamps: true }
);

const ServicesModel = mongoose.model("services", servicesSchema);

module.exports = ServicesModel;

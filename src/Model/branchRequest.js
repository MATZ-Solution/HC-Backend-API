const mongoose = require("mongoose");

const branchRequestSchema = new mongoose.Schema({
  branchManagerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "BranchManager",
  },
  corporateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Corporate",
  },
  patId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Patient",
  },
  branchId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Branch", // Reference to the Branch model
  },
  status: {
    type: Number,
  },
  isApprovedBySuperAdmin: {
    type: Boolean,
    default: false,
  },
  isApprovedBySeniorCare: {
    type: Boolean,
    default: false,
  },
});

const BranchRequest = mongoose.model("BranchRequest", branchRequestSchema);

module.exports = BranchRequest;

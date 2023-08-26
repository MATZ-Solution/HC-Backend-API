const mongoose = require('mongoose');

const rolesEnum = ["super-admin", "care-givers", "patient", "corporate","manager"];
const genderEnum = ["male", "female", "non-binary"];

const branchManagerSchema = new mongoose.Schema({
  firstName: {
    type: String
  },
  middleName: {
    type: String
  },
  lastName: {
    type: String
  },
  branchAdminEmail: {
    type: String
  },
  branchAdminContactNo: {
    type: Number
  },
  password: {
    type: String
  },
  branchAdminAddress: {
    type: String
  },
  gender: {
    type: String,
    enum:genderEnum
  },
  branchManagerRole: {
    type: String,
    default: "manager",
    enum:rolesEnum
  },
  profilePic: {
    type: String
  },
  corporateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Corporate",
  }
});

// Create the BranchManager model
const BranchManager = mongoose.model('BranchManager', branchManagerSchema);

module.exports = BranchManager;

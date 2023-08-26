const mongoose = require("mongoose");

// Define the Mongoose schema for the advisor
const advisorSchema = new mongoose.Schema({
  firstName: {
    type: String,
  },
  middleName: {
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
  role: {
    type: String,
    enum: ["advisor"],
    default: "advisor",
  },
  password: {
    type: String,
  },
  advisorAddress: {
    type: String,
  },
  gender: {
    type: String,
  },
  status: {
    type: Boolean,
    default:false  // if it is true advisor offline otherwise online
  },
  profilePic: {
    type: String,
    default: "",
  },
  superAdminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "superAdmin",
  },
});

// Create the Mongoose model
const Advisor = mongoose.model("Advisor", advisorSchema);

module.exports = Advisor;

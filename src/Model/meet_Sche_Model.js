const mongoose = require("mongoose");

const meetSchema = mongoose.Schema(
  {
    Name: {
      type: String,
    },
    contactNo: {
      type: String,
    },
    Email: {
      type: String,
    },
    selectDate: {
      type: String,
    },
    setTime: {
      type: String,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);
const meetmodel = mongoose.model("meet", meetSchema);

module.exports = meetmodel;

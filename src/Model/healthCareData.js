const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const addressSchema = new Schema({
  website: {
    type: String,
    required: true
  },
  phoneNumber: {
    type: String,
    required: true
  },
  address: {
    fullAddress: {
      type: String,
      required: true
    },
    zipCode: {
      type: String,
      required: true
    },
    state: {
      type: String,
      required: true
    }
  },
  closed: {
    type: String,
    default:""
  },
  openingHours: {
    Mon: { type: String },
    Tue: { type: String },
    Wed: { type: String },
    Thu: { type: String },
    Fri: { type: String },
    Sat: { type: String },
    Sun: { type: String }
  }
});

const Address = mongoose.model('Address', addressSchema);

module.exports = Address;

const mongoose = require('mongoose');
const fromEnum = ['WEB', 'MOBILE'];

const Schema = mongoose.Schema;

const otpSchema = new Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  corporateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'facilityOwnerAndProfessional',
  },
  from: {
    type: String,
    enum: fromEnum,
  },
  noOfCounts: {
    type: Number,
  },
});

module.exports = mongoose.model('NoOfCallsMade', otpSchema);

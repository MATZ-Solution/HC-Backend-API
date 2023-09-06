const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const otpSchema = new Schema({
  corporateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'facilityOwnerAndProfessional',
  },
  clinicanCode: { type: String },
});

module.exports = mongoose.model('facilityOwnerOtp', otpSchema);

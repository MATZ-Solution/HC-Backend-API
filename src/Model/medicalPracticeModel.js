const mongoose = require('mongoose');

const medicalPracticeSchema = new mongoose.Schema({
  patients: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  facilityOwners: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'facilityOwnerAndProfessional',
  },
});

const MedicalPractice = mongoose.model(
  'MedicalPractice',
  medicalPracticeSchema
);

module.exports = MedicalPractice;

const mongoose = require('mongoose');

const rolesEnum = ['super-admin'];
const genderEnum = ['male', 'female', 'non-binary'];

const superAdminSchema = new mongoose.Schema(
  {
    email: {
      type: String,
    },
    password: {
      type: String,
    },
    role: {
      type: String,
      default: 'super-admin',
      enum: rolesEnum,
    },
    firstName: {
      type: String,
    },
    middleName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    phoneNumber: {
      type: String,
    },
    profilePic: {
      type: String,
    },
    fcmToken: {
      type: String,
    },
    dateOfBirth: {
      type: String,
    },
    gender: {
      type: String,
      default: 'male',
      enum: genderEnum,
    },
    region: {
      type: String,
    },
    state: {
      type: String,
    },
    city: {
      type: String,
    },
    zipCode: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('superAdmin', superAdminSchema);

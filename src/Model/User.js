const mongoose = require('mongoose');

const rolesEnum = ['super-admin', 'care-givers', 'patient', 'corporate'];
const genderEnum = ['male', 'female', 'non-binary'];

const UserSchema = new mongoose.Schema(
  {
    //patient
    email: {
      type: String,
    },
    password: {
      type: String,
    },
    role: {
      type: String,
      default: 'patient',
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
    dateOfBirth: {
      type: String,
    },
    gender: {
      type: String,
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
    seekCareFor: {
      type: String,
    },
    fcmToken: {
      type: String,
    },
    //otp verfied then true otherwise false
    isOtpVerified: {
      type: Boolean,
      default: false,
    },
    isProfileCompleted: {
      type: Boolean,
      default: false,
    },

    //patient

    //if is vital true go to dashboard
    isVital: {
      type: Boolean,
      default: false,
    },

    //this is for social Media
    profileId: {
      type: String,
    },
    isSocialMediaAuth: {
      type: Boolean,
      default: false,
    },
    //this is for social Media end
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', UserSchema);

const mongoose = require("mongoose");

const genderEnum = ["male", "female", "non-binary"];
const rolesEnum = ["super-admin", "care-givers", "patient", "corporate"];

const corporateSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      default: ""
    },
    phoneNumber: {
      type: Number
    },
    password: {
      type: String,
    },
    role: {
      type: String,
      enum: rolesEnum,
    },
    firstName: {
      type: String
    },
    middleName: {
      type: String
    },
    lastName: {
      type: String,
      defautl: ""
    },
    adminPhoneNo: {
      type: Number,
    },
    profilePic: {
      type: String,
      default: ""
    },
    dateOfBirth: {
      type: Date,
    },
    gender: {
      type: String,
      enum: genderEnum,
    },
    position: {
      type: String
    },
    complaintIds: [{
      mongoDbID: String,
      category: String
    }],
    adminAddress: {
      type: String,
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
    latitude: {
      type: String
    },
    longitude: {
      type: String
    },
    mongoDbID: {
      type: String
    },
    category: {
      type: String
    },
    organizationName: {
      type: String,
    },
    organizationMainOfficeAddress: {
      type: String,
    },
    organizationRegion: {
      type: String,
    },
    organizationState: {
      type: String,
    },
    organizationCity: {
      type: String,
    },
    organizationZipCode: {
      type: String,
    },
    organizationContactNo: {
      type: String,
    },
    organizationEmail: {
      type: String,
    },
    websiteLink: {
      type: String,
    },
    licenseNo: {
      type: Number,
    },
    yearsOfExperience: {
      type: String,
    },
    uploadLegalDoc: {
      type: [String],
    },
    additionalMessage: {
      type: String,
    },
    isCreatedByProperRegisteration: {
      type: Boolean,
      default: false
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

    //this is for social Media
    profileId: {
      type: String,
    },
    isSocialMediaAuth: {
      type: Boolean,
      default: false,
    },
    //this is for social Media end

    //isApprovedbyAdmin
    isApprovedbyAdmin: {
      type: Boolean,
      default: false,
    },

    //how many customerContacted this corporate
    conatactedCustomer: {
      type: Number,
      default: 0
    },
  },
  { timestamps: true }
);

const Corporate = mongoose.model("facilityOwnerAndProfessional", corporateSchema);

module.exports = Corporate;

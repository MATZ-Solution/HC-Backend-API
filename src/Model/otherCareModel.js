const mongoose = require("mongoose");
const rolesEnum = ["super-admin", "care-givers", "patient", "corporate"];
const genderEnum = ["male", "female", "non-binary"];

const otherCareSchema = new mongoose.Schema(
  {
    email: {
      type: String,
    },
    password: {
      type: String,
    },
    role: {
      type: String,
      default: "care-givers",
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
      default: "male",
      enum: genderEnum,
    },
    address: {
        type:String
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

    LicenseNo: {
      type: String,
    },
    EducationCertificateDetails: {
      type: String,
    },
    UploadLegalDoc: [
      {
        type: String,
      },
    ],
    otherCareIssuingAuthority: {
      type: String,
    },
    otherCareIssuingDate: {
      type: String,
    },
    otherCareMedicalSpecialization: {
      typ: String,
    },
    otherMedicalProfession: {
      type: String,
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("otherCare", otherCareSchema);

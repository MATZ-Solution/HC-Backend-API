const mongoose = require('mongoose');

const patApplyService = mongoose.Schema(
  {
    patFullName: {
      type: String,
    },
    patAddress: {
      type: String,
    },
    patPhoneNumber: {
      type: String,
    },
    patDescription: {
      type: String,
    },
    patIpLocationAddress: {
      type: String,
    },
    patCityIpAddress: {
      type: String,
    },
    mainCategory: {
      type: String,
    },
    patEmail: {
      type: String,
    },
    category: {
      type: String,
    },
    scrapeMongoDbID: {
      type: String,
    },
    serviceCategory: {
      type: String,
    },
    serviceName: {
      type: String,
    },
    serviceCity: {
      type: String,
    },
    servicePhoneNumber: {
      type: String,
    },
    serviceFullAddress: {
      type: String,
    },
    serviceZipCode: {
      type: String,
    },
    serviceState: {
      type: String,
    },
    serviceLatitude: {
      type: String,
    },
    serviceLongitude: {
      type: String,
    },
    serviceOverAllRating: {
      type: String,
    },
    servicePatientSurveyRating: {
      type: String,
    },
    isAdminApproveStatus: {
      type: Boolean,
      default: false,
    },
    corporateContacted: {
      type: Number,
      default: 0,
    },
    //for registeredpatId
    registeredPatId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    //for registeredsuperadminid
    registeredSuperAdminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'superAdmin',
    },
    //for registeredcorporateId
    registeredCorporateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'facilityOwnerAndProfessional',
    },
    isRejected: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const patientApplyService = mongoose.model('patApplyService', patApplyService);

module.exports = patientApplyService;

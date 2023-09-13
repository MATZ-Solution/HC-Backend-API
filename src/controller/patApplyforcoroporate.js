const patService = require('../Model/patApplyService');
const superAdmin = require('../Model/superAdminModel');
const FcmNotify = require('utils/fcmNotify');
const Notification = require('../Model/notiHistoryModel');

//patient apply for service
const patApplyforcoroporate = async (req, res, next) => {
  try {
    const {
      patName,
      patAddress,
      patPhoneNumber,
      patDescription,
      patIpLocationAddress,
      patCityIpAddress,
      patEmail,
      mainCategory,
      seviceId,
      serviceCategory,
      serviceCity,
      servicePhoneNumber,
      serviceFullAddress,
      serviceZipCode,
      serviceState,
      serviceLatitude,
      serviceLongitude,
      serviceOverAllRating,
      servicePatientSurveyRating,
      category,
      serviceName,
    } = req.body;

    // Create a new instance of the Mongoose model using the provided data
    const newApplication = new patService({
      patFullName: patName,
      patAddress: patAddress,
      patPhoneNumber: patPhoneNumber,
      patDescription: patDescription,
      patIpLocationAddress,
      patCityIpAddress,
      patEmail,
      mainCategory,
      category,
      serviceName,
      scrapeMongoDbID: seviceId,
      serviceCategory: serviceCategory,
      serviceCity: serviceCity,
      servicePhoneNumber: servicePhoneNumber,
      serviceFullAddress: serviceFullAddress,
      serviceZipCode: serviceZipCode,
      serviceState: serviceState,
      serviceLatitude: serviceLatitude,
      serviceLongitude: serviceLongitude,
      serviceOverAllRating: serviceOverAllRating,
      servicePatientSurveyRating: servicePatientSurveyRating,
    });

    // Save the new application to the database
    const savedApplication = await newApplication.save();

    //get All superAdmin
    const getAllSuperAdmin = await superAdmin.find();

    const getSuperAdminfcmToken = await superAdmin
      .find()
      .select('fcmToken -_id');

    const notificationData = 'A new patient request has been submitted.';

    for (const superAdmin of getAllSuperAdmin) {
      const saveNotiHistory = new Notification({
        title: 'Patient Requested',
        Notification: 'A new patient request has been submitted.',
        type: 'super-admin',
        superAdminId: superAdmin._id,
      });

      await saveNotiHistory.save();
    }

    // console.log(getSuperAdminfcmToken)
    getSuperAdminfcmToken.forEach((token) => {
      console.log(token.fcmToken);
      if (token.fcmToken) {
        token.fcmToken.map((fcmToken) => {
          console.log(fcmToken);
          FcmNotify(token.fcmToken, notificationData, 'super-admin');
        });
      }
    });

    res.status(201).json({
      message: 'Application submitted successfully.',
      application: savedApplication,
    });
  } catch (err) {
    next(err);
  }
};

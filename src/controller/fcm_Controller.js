var admin = require('firebase-admin');
// const serviceAccount = require('../utils/healthcare-f8e9b-firebase-adminsdk-3rc82-ab38bc6b10.json');
const User = require('../Model/User');
const superAdmin = require('../Model/superAdminModel');
const corporate = require('../Model/corporateModel');
const ErrorHandler = require('../utils/ErrorHandler');

process.env.GOOGLE_APPLICATION_CREDIENTIALS;

const FCM_Clt = {
  createFCM: async (req, res, next) => {
    try {
      let { _id, isAdmin } = req.user;
      const { fcmToken } = req.body;

      if (isAdmin === 'patient') {
        const pat = await User.findOneAndUpdate(
          { _id },
          { fcmToken: fcmToken },
          { new: true }
        );

        if (pat) {
          res.status(200).json({
            msg: 'Updated!',
          });
        } else {
          throw new ErrorHandler("Patient doesn't Exist", 400);
        }
      } else if (isAdmin === 'super-admin') {
        const superAdminUser = await superAdmin.findOneAndUpdate(
          { _id },
          { fcmToken: fcmToken },
          { new: true }
        );

        if (superAdminUser) {
          res.status(200).json({
            msg: 'Updated!',
          });
        } else {
          throw new ErrorHandler("Super-Admin doesn't Exist", 400);
        }
      } else if (isAdmin === 'corporate') {
        const corporateUser = await corporate.findOneAndUpdate(
          { _id },
          { fcmToken: fcmToken },
          { new: true }
        );

        if (corporateUser) {
          res.status(200).json({
            msg: 'Updated!',
            corporateUser,
          });
        } else {
          throw new ErrorHandler("Corporate doesn't Exist", 400);
        }
      }
    } catch (err) {
      next(err);
    }
  },
};

module.exports = FCM_Clt;

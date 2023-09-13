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
        const newsuperAdmin = await superAdmin.findById(_id);

        if (!superAdmin) {
          throw new Error('Super Admin not found');
        }

        // Check if the newToken already exists in the fcmToken array
        const tokenExists = newsuperAdmin.fcmToken.includes(fcmToken);
        console.log('tokenExists', tokenExists);

        if (tokenExists) {
          // if Token  exists, then remove it
          newsuperAdmin.fcmToken = newsuperAdmin.fcmToken.filter(
            (token) => token !== fcmToken
          );
        } else {
          // Token doesn't exist, so add it
          newsuperAdmin.fcmToken.push(fcmToken);
        }

        // Save the updated superAdmin document
        await newsuperAdmin.save();
        res
          .status(200)
          .json({ success: true, message: 'FCM token updated successfully' });
      } else if (isAdmin === 'corporate') {
        const getCorporate = await corporate.findById(_id);

        if (!getCorporate) {
          throw new Error('Super Admin not found');
        }

        // Check if the newToken already exists in the fcmToken array
        const tokenExists = getCorporate.fcmToken.includes(fcmToken);
        
        if (tokenExists) {
          // if Token  exists, then remove it
          getCorporate.fcmToken = getCorporate.fcmToken.filter(
            (token) => token !== fcmToken
          );
        } else {
          // Token doesn't exist, so add it
          getCorporate.fcmToken.push(fcmToken);
        }

        // Save the updated superAdmin document
        await getCorporate.save();
        res
          .status(200)
          .json({ success: true, message: 'FCM token updated successfully' });
      }
    } catch (err) {
      next(err);
    }
  },
};

module.exports = FCM_Clt;

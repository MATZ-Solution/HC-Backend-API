var admin = require('firebase-admin');
const serviceAccount = require('../utils/healthcare-f8e9b-firebase-adminsdk-3rc82-ab38bc6b10.json');
const User = require('../Model/User');
const superAdmin = require('../Model/superAdminModel');
const ErrorHandler = require('../utils/ErrorHandler');


process.env.GOOGLE_APPLICATION_CREDIENTIALS;

const FCM_Clt = {
  createFCM: async (req, res, next) => {
    try {
      let { _id, isAdmin } = req.user;

      if (isAdmin === 'patient') {
        const { fcmToken } = req.body;
        const superAdminUser = await User.findOneAndUpdate(
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
      } else if (isAdmin === 'super-admin') {
        const { fcmToken } = req.body;
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
      }
    } catch (err) {
      next(err);
    }
  },

  // pushNot: async (arg, message) => {
  //   const fcmToken = await User.find({
  //     $and: [
  //       { fcmToken: { $exists: true } }, // Check if fcmToken field exists
  //       { fcmToken: { $ne: null } }, // Check if fcmToken field is not null
  //       { type: 'Patient' },
  //     ],
  //   });
  //   for (let k = 0; k < fcmToken.length; k++) {
  //     let token = fcmToken[k].fcmToken;
  //     let userId = fcmToken[k]._id;
  //     const getMedication = await medication.find({
  //       user: userId,
  //     });
  //     const timesArrays = getMedication.map((medication) => medication.Times);
  //     // Step 2: Flatten all "Times" arrays into a single array of time objects
  //     const allTimes = [].concat(...timesArrays);
  //     // Step 3: Use a Set to remove duplicates and convert it back to an array
  //     const uniqueTimes = Array.from(
  //       new Set(allTimes.map((time) => time.time))
  //     );

  //     // Optional: Sort the array based on the "time" property
  //     uniqueTimes.sort((a, b) => a.localeCompare(b));

  //     console.log(uniqueTimes);
  //     for (let j = 0; j < uniqueTimes.length; j++) {
  //       if (arg == 'AM') {
  //         if (uniqueTimes[j] === 'AM') {
  //           console.log('time', uniqueTimes[j]);
  //           FcmNotify(token, message);
  //         }
  //       } else if (arg == 'PM') {
  //         if (uniqueTimes[j] === 'PM') {
  //           console.log('time', uniqueTimes[j]);
  //           FcmNotify(token, message);
  //         }
  //       } else if (arg == 'AFT') {
  //         if (uniqueTimes[j] === 'AFT') {
  //           console.log('time', uniqueTimes[j]);
  //           FcmNotify(token, message);
  //         }
  //       }
  //     }
  //   }
  // },
};

// function FcmNotify(token, data) {
//   if (!admin.apps.length) {
//     admin.initializeApp({
//       credential: admin.credential.cert(serviceAccount),
//       messagingSenderId: '314005293340',
//     });
//   }
//   message = {
//     notification: {
//       title: 'Medication Reminder',
//       body: data,
//     },

//     token: token,
//     data: {
//       orderId: '353463',
//       orderDate: '54236456',
//     },
//   };
//   admin
//     .messaging()
//     .send(message)
//     .then((response) => {
//       console.log('Notification sent successfully:', response);
//     })
//     .catch((error) => {
//       console.error('Error sending notification:', error.stack);
//     });
// }
module.exports = FCM_Clt;

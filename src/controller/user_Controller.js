const User = require('../Model/User');
const Corporate = require('../Model/corporateModel');
const Otp = require('../Model/Otp');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const CryptoJS = require('crypto-js');
const ErrorHandler = require('../utils/ErrorHandler');
const otherCareModel = require('../Model/otherCareModel');
const Vital = require('../Model/vitalModel');
const patService = require('../Model/patApplyService');
const axios = require('axios');
const invoice = require('../Model/invoiceModel');
const superAdmin = require('../Model/superAdminModel');
const facilityOtp = require('../Model/facilityOtp');
const medicalPractice = require('../Model/medicalPracticeModel');
const { Console } = require('console');

// Controller for changing password

const changePasswordController = async (req, res, next) => {
  const { oldPassword, newPassword } = req.body;

  try {
    const userId = req.user._id;
    const user = await User.findById(userId);

    // Decrypt and compare passwords
    const decryptedPassword = CryptoJS.AES.decrypt(
      user.password,
      process.env.PASS_SEC
    ).toString(CryptoJS.enc.Utf8);

    if (decryptedPassword !== oldPassword) {
      throw new ErrorHandler('Old Password not matched', 400);
    }

    if (newPassword === decryptedPassword) {
      throw new ErrorHandler(
        'New Password should not match with the old password',
        400
      );
    }

    // Encrypt new password
    const encryptedNewPassword = CryptoJS.AES.encrypt(
      newPassword,
      process.env.PASS_SEC
    ).toString();

    // Update user's password
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: { password: encryptedNewPassword } },
      { new: true }
    );

    res.status(200).json(updatedUser);
  } catch (err) {
    next(err);
  }
};

//user info

const userInfoController = async (req, res, next) => {
  try {
    const { _id, isAdmin } = req.user;

    if (isAdmin === 'patient') {
      // Fetch user data
      const user = await User.findById(_id);
      if (!user) {
        throw new ErrorHandler('User Not Found', 404);
      }

      // Fetch vital data
      const vital = await Vital.findOne({ userId: _id });
      if (!vital) {
        // If vital data not found, it can be handled based on your use case
        // For now, we'll assume the vital object to be an empty object
        const vital = {};
      }

      // Exclude sensitive information from the response
      const {
        password: _,
        createdAt,
        updatedAt,
        isSocialMediaAuth,
        isVerified,
        profileId,
        __v,
        ...others
      } = user._doc;

      // Combine user and vital data in the response
      const userInfo = {
        ...others,
        vital,
      };

      res.status(200).json(userInfo);
    } else if (isAdmin === 'care-givers') {
      // Handle care-givers specific logic if needed
      // For now, we don't have any implementation here
      res
        .status(200)
        .json({ message: 'Care-givers data can be handled here.' });
    } else if (isAdmin === 'corporate') {
      let data = await Corporate.find({ _id }).lean();
      res.status(200).json(data);
    } else if (isAdmin === 'super-admin') {
      let data = await superAdmin.findOne({ _id }).lean();
      res.status(200).json(data);
    } else {
      throw new ErrorHandler('Invalid Role', 400);
    }
  } catch (err) {
    next(err);
  }
};

//corporate data

const specificCorporateData = async (req, res, next) => {
  try {
    // const { servicePhoneNumber } = req.params;
    const { _id } = req.user;

    const foundCorporate = await Corporate.findOne({ _id });

    if (foundCorporate) {
      const data = await patService
        .find({
          servicePhoneNumber: foundCorporate.organizationContactNo,
          isAdminApproveStatus: true,
        })
        .lean();

      if (data.length > 0) {
        res.status(200).json(data);
      } else {
        res.status(404).json({ message: 'No Data Found' });
      }
    }
  } catch (err) {
    next(err);
  }
};

//update User

const updatedUser = async (req, res, next) => {
  try {
    const { role } = req.body;

    if (role === 'patient') {
      const user = await User.findOneAndUpdate(
        { email: req.body.email }, // Find the user based on the email
        { ...req.body, isProfileCompleted: true }, // Update the user's information
        { new: true } // Return the updated user object
      );
      if (user) {
        // User found and updated
        res.status(200).json('User Updated');
      } else {
        // User not found
        throw new ErrorHandler('User Not Found', 400);
      }
    } else if (role === 'care-givers') {
      const otherCare = await otherCareModel.findOneAndUpdate(
        { email: req.body.email }, // Find the user based on the email
        { ...req.body, isProfileCompleted: true }, // Update the user's information
        { new: true } // Return the updated user object
      );

      if (otherCare) {
        // User found and updated
        res.status(200).json('otherCare Updated');
      } else {
        // User not found
        throw new ErrorHandler('User Not Found', 400);
      }
    } else if (role === 'corporate') {
      const corporate = await Corporate.findOneAndUpdate(
        { email: req.body.email }, // Find the user based on the email
        { ...req.body, isProfileCompleted: true }, // Update the user's information
        { new: true } // Return the updated user object
      );

      if (corporate) {
        // User found and updated
        res.status(200).json('corporate Updated');
      } else {
        // User not found
        throw new ErrorHandler('User Not Found', 400);
      }
    }
  } catch (error) {
    next(error);
  }
};

//updateProfileUsingToken

const updatedProfile = async (req, res, next) => {
  try {
    const { _id, isAdmin } = req.user;

    if (isAdmin === 'patient') {
      const user = await User.findOneAndUpdate(
        { _id },
        { ...req.body },
        { new: true }
      );
      if (user) {
        res.status(200).json('User Updated');
      } else {
        throw new ErrorHandler('User Not Found', 400);
      }
    } else if (isAdmin === 'care-givers') {
      const otherCare = await otherCareModel.findOneAndUpdate(
        { _id },
        { ...req.body },
        { new: true }
      );

      if (otherCare) {
        // User found and updated
        res.status(200).json('otherCare Updated');
      } else {
        // User not found
        throw new ErrorHandler('User Not Found', 400);
      }
    } else if (isAdmin === 'corporate') {
      const corporate = await Corporate.findOneAndUpdate(
        { _id }, // Find the user based on the email
        { ...req.body }, // Update the user's information
        { new: true } // Return the updated user object
      );

      if (corporate) {
        // User found and updated
        res.status(200).json('corporate Updated');
      } else {
        // User not found
        throw new ErrorHandler('User Not Found', 400);
      }
    } else if (isAdmin === 'super-admin') {
      const updatedData = await superAdmin.findOneAndUpdate(
        { _id }, // Find the user based on the email
        { ...req.body }, // Update the user's information
        { new: true } // Return the updated user object
      );

      if (updatedData) {
        // User found and updated
        res.status(200).json('SuperAdmin Updated');
      } else {
        // User not found
        throw new ErrorHandler('User Not Found', 400);
      }
    }
  } catch (error) {
    next(error);
  }
};

//verify email sending otp to the email

const verifyEmail = async (req, res, next) => {
  try {
    let data = await User.findOne({ email: req.body.email });

    if (data) {
      const otpCode = '0123456789';
      let result;
      async function generateRandomString(length) {
        result = '';
        let charactersLength = otpCode.length;
        for (let i = 0; i < length; i++) {
          result += otpCode.charAt(crypto.randomBytes(1)[0] % charactersLength);
        }
      }
      generateRandomString(4);
      // let otpCode = Math.floor((Math.random()*10000) + 1);
      let otpData = new Otp({
        email: req.body.email,
        code: result,
        expiresIn: new Date(Date.now() + 60000),
      });
      let otpResponse = await otpData.save();
      res.status(200).json({ msg: 'Please Check Your Email' });
      mailer(req.body.email, otpResponse.code);
    } else {
      throw new ErrorHandler('Your email id doesnot exist', 400);
    }
  } catch (error) {
    next(error);
  }
};

const verifyOtp = async (req, res, next) => {
  const { email, code, role } = req.body;
  try {
    if (role === 'patient') {
      let data = await Otp.findOne({ email: email, code: code });
      if (data) {
        await User.findOneAndUpdate({ email }, { isOtpVerified: true });
        res.status(200).json({ msg: 'Email Verified' });
      } else {
        throw new ErrorHandler('Invalid OTP', 400);
      }
    } else if (role === 'care-givers') {
      //doctor verification logic here...
      let data = await Otp.findOne({ email: email, code: code });
      if (data) {
        await otherCareModel.findOneAndUpdate(
          { email },
          { isOtpVerified: true }
        );
        res.status(200).json({ msg: 'Email Verified' });
      } else {
        throw new ErrorHandler('Invalid OTP', 400);
      }
    } else if (role === 'corporate') {
      //doctor verification logic here...
      let data = await Otp.findOne({ email: email, code: code });
      if (data) {
        await Corporate.findOneAndUpdate({ email }, { isOtpVerified: true });
        res.status(200).json({ msg: 'Email Verified' });
      } else {
        throw new ErrorHandler('Invalid OTP', 400);
      }
    }
  } catch (error) {
    next(error);
  }
};

// Controller for deleting a user
const deleteUserController = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.user._id);
    if (!user) {
      throw new ErrorHandler('USER NOT FOUND', 400);
    }
    res.status(200).json('User has been deleted...');
  } catch (err) {
    next(err);
  }
};

const sendEmail = async (req, res, next) => {
  try {
    if (role === 'patient') {
      let data = await User.findOne({ email: req.body.email });

      if (data) {
        const otpCode = '0123456789';
        let result;
        async function generateRandomString(length) {
          result = '';
          let charactersLength = otpCode.length;
          for (let i = 0; i < length; i++) {
            result += otpCode.charAt(
              crypto.randomBytes(1)[0] % charactersLength
            );
          }
        }
        generateRandomString(4);
        // let otpCode = Math.floor((Math.random()*10000) + 1);
        let otpData = new Otp({
          email: req.body.email,
          code: result,
          expiresIn: new Date(Date.now() + 60000),
          // expiresIn: new Date().getTime() + 0.002 * 1000
        });
        let otpResponse = await otpData.save();
        res.status(200).json({ msg: 'Please Check Your Email' });
        mailer(req.body.email, otpResponse.code);
      } else {
        throw new ErrorHandler('Your email id doesnot exist in db', 400);
      }
    } else if (role === 'care-givers') {
      let data = await User.findOne({ email: req.body.email });

      if (data) {
        const otpCode = '0123456789';
        let result;
        async function generateRandomString(length) {
          result = '';
          let charactersLength = otpCode.length;
          for (let i = 0; i < length; i++) {
            result += otpCode.charAt(
              crypto.randomBytes(1)[0] % charactersLength
            );
          }
        }
        generateRandomString(4);
        // let otpCode = Math.floor((Math.random()*10000) + 1);
        let otpData = new Otp({
          email: req.body.email,
          code: result,
          expiresIn: new Date(Date.now() + 60000),
          // expiresIn: new Date().getTime() + 0.002 * 1000
        });
        let otpResponse = await otpData.save();
        res.status(200).json({ msg: 'Please Check Your Email' });
        mailer(req.body.email, otpResponse.code);
      } else {
        throw new ErrorHandler('Your email id doesnot exist in db', 400);
      }
    } else {
    }
  } catch (error) {
    next(error);
  }
};

const verifyforgetPasswordOtp = async (req, res, next) => {
  const { email, code } = req.body;
  try {
    let data = await Otp.findOne({ email: email, code: code });
    if (data) {
      res.status(200).json({ msg: 'Email Verified' });
    } else {
      throw new ErrorHandler('Invalid OTP', 400);
    }
  } catch (error) {
    next(error);
  }
};
// Controller for sending a password reset email
const forgotPasswordController = async (req, res, next) => {
  try {
    const { password, confirmPassword } = req.body;
    if (password === confirmPassword) {
      // const salt = await bcrypt.genSalt(10);
      const hash = await CryptoJS.AES.encrypt(
        req.body.password,
        process.env.PASS_SEC
      ).toString();
      const user = await User.findOneAndUpdate(
        { email: req.body.email },
        {
          password: hash,
        },
        {
          new: true,
        }
      );
      await user.save();
      res.status(200).json({ msg: 'Password Change Sucessfully' });
    } else {
      throw new ErrorHandler('Password And confirm Password not matched', 400);
    }
  } catch (error) {
    next(error);
  }
};

// super Admin

const allUsers = async (req, res, next) => {
  try {
    const allUsers = await User.find({
      role: { $in: ['corporate', 'care givers'] },
    }).select(
      '-isVerified -profileId -profile -isSocialMediaAuth -isAdminApprove -isProfileCompleted -createdAt -password -updatedAt -__v'
    );

    res.status(200).json({ UserList: allUsers });
  } catch (error) {
    next(error);
  }
};

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

    // Return a success response
    res.status(201).json({
      message: 'Application submitted successfully.',
      application: savedApplication,
    });
  } catch (err) {
    next(err);
  }
};

//superAdminViewing the data patApplyService

const getPatApplyService = async (req, res, next) => {
  try {
    const patServices = await patService.find().lean();
    res.status(200).json(patServices);
  } catch (err) {
    next(err);
  }
};

//is admin approve patienapply service

const isAdminApprovePatientService = async (req, res, next) => {
  try {
    const { patMongoId } = req.params;
    const updatedData = await patService.findByIdAndUpdate(
      patMongoId,
      { isAdminApproveStatus: true },
      { new: true }
    );

    if (updatedData) {
      const existEmail = await Corporate.find({
        organizationContactNo: updatedData.servicePhoneNumber,
      });

      if (existEmail.length !== 0) {
        let corporate = await Corporate.findOneAndUpdate(
          { email: updatedData.servicePhoneNumber },
          { $inc: { conatactedCustomer: 1 } },
          { new: true }
        );

        let createInvoie = await invoice.create({
          category: corporate.category,
          leadsId: corporate.mongoDbID,
          patientId: updatedData._id,
          corporateId: corporate._id,
          leadAmount: req.body.leadAmount,
          subTotal: req.body.subTotal,
          grandTotal: req.body.grandTotal,
          discount: req.body.discount,
          dueDate: req.body.dueDate,
          additionalMessage: req.body.additionalMessage,
        });

        await createInvoie.save();

        res.status(200).json({ message: 'Updated', data: updatedData });
      } else {
        console.log(updatedData);
        const createUser = await Corporate.create({
          email: updatedData.servicePhoneNumber,
          password: CryptoJS.AES.encrypt(
            '12345678',
            process.env.PASS_SEC
          ).toString(),
          role: 'corporate',
          organizationName: updatedData.serviceName,
          organizationCity: updatedData.serviceCity,
          organizationMainOfficeAddress: updatedData.serviceFullAddress,
          organizationZipCode: updatedData.serviceZipCode,
          organizationState: updatedData.serviceState,
          organizationContactNo: updatedData.servicePhoneNumber,
          latitude: updatedData.serviceLatitude,
          longitude: updatedData.serviceLongitude,
          mongoDbID: updatedData.scrapeMongoDbID,
          category: updatedData.mainCategory,
          conatactedCustomer: 1,
        });

        let corporate = await createUser.save();

        let createInvoie = await invoice.create({
          category: corporate.category,
          leadsId: corporate.mongoDbID,
          patientId: updatedData._id,
          corporateId: corporate._id,
          leadAmount: req.body.leadAmount,
          subTotal: req.body.subTotal,
          grandTotal: req.body.grandTotal,
          discount: req.body.discount,
          dueDate: req.body.dueDate,
          additionalMessage: req.body.additionalMessage,
        });

        await createInvoie.save();

        async function generateUniqueOTP() {
          let otp;
          let isUnique = false;

          while (!isUnique) {
            otp = await generateOTP();
            const existingOtp = await facilityOtp.findOne({
              clinicanCode: otp,
            });

            if (!existingOtp) {
              isUnique = true;
            }
          }
          return otp;
        }

        const otp = await generateUniqueOTP();

        const createFacilityOtp = await facilityOtp.create({
          corporateId: corporate._id,
          clinicanCode: otp,
        });

        await createFacilityOtp.save();

        res.status(200).json({ message: 'Updated', data: updatedData });
      }
    } else {
      res.status(200).json({ message: 'No Data Found' });
    }
  } catch (err) {
    next(err);
  }
};

//Super Admin getting all the corporates data which are coming from scrapping

// const getAllCorporates = async (req, res, next) => {
//   try {
//     const getAllCorporatesData = await Corporate.find({
//       isCreatedByProperRegistration: false, // Corrected typo in the field name
//     });

//     const apiUrl =
//       'http://localhost:3000/api/healthCareRoute/getCorporatesUsingMongoId';

//     const corporatesWithComplaints = await Promise.all(
//       getAllCorporatesData.map(async (corporate) => {
//         try {
//           const corporateInvoice = await invoice.find({
//             corporateId: corporate._id,
//           });

//           console.log(corporate)

//           console.log(corporate.mongoDbID)
//           console.log(corporate.categorycategory)

// const scrapedResponse = await axios.post(apiUrl, {
//   mongoDbID: corporate.mongoDbID, // Use the relevant field here
//   category: corporate.category,
// });

// console.log(scrapedResponse);

// if (scrapedResponse.status === 200) {
//   const { _doc: corporateData } = corporate;
//   return {
//     ...corporateData,
//     Scraped: scrapedResponse.data,
//     corporateInvoice: corporateInvoice,
//   };
// } else {
//   return {
//     ...corporateData,
//     Scraped: [],
//     corporateInvoice: corporateInvoice,
//   };
// }
//         } catch (error) {
//           const { _doc: corporateData } = corporate;
//           return {
//             ...corporateData,
//             complaints: [],
//             corporateInvoice: [],
//           }; // Return an empty array for complaints on error
//         }
//       })
//     );

//     if (corporatesWithComplaints.length > 0) {
//       res.status(200).json(corporatesWithComplaints);
//     } else {
//       res.status(200).json('No Data Found');
//     }
//   } catch (err) {
//     next(err);
//   }
// };

const getAllCorporates = async (req, res, next) => {
  try {
    const getAllCorporatesData = await Corporate.find({
      isCreatedByProperRegisteration: false,
    });

    const apiUrl =
      'http://hc-scrapted-data.eba-pmas6jv8.ap-south-1.elasticbeanstalk.com/api/healthCareRoute/getCorporatesUsingMongoId';

    const corporatesWithComplaints = await Promise.all(
      getAllCorporatesData.map(async (corporate) => {
        try {
          const corporateInvoice = await invoice.find({
            corporateId: corporate._id,
          });

          const getDoctorCode = await facilityOtp
            .findOne({
              corporateId: corporate._id,
            })
            .select('clinicanCode');

          const scrapedResponse = await axios.post(apiUrl, {
            mongoDbID: corporate.mongoDbID, // Use the relevant field here
            category: corporate.category,
          });

          if (scrapedResponse.status === 200) {
            const { _doc: corporateData } = corporate;
            return {
              ...corporateData,
              Scraped: scrapedResponse.data,
              getDoctorCode: getDoctorCode,
              corporateInvoice: corporateInvoice,
            };
          } else {
            const { _doc: corporateData } = corporate;
            return {
              ...corporateData,
              Scraped: [],
              getDoctorCode: getDoctorCode,
              corporateInvoice: corporateInvoice,
            };
          }
        } catch (error) {
          const { _doc: corporateData } = corporate;
          return { ...corporateData, complaints: [], corporateInvoice: [] }; // Return an empty array for complaints on error
        }
      })
    );

    if (corporatesWithComplaints.length > 0) {
      res.status(200).json(corporatesWithComplaints);
    } else {
      res.status(200).json('No Data Found');
    }
  } catch (err) {
    next(err);
  }
};

//patient add clinican code to connect corporate

const toConnectCorporate = async (req, res, next) => {
  try {
    let { connect } = req.body;
    let { _id } = req.user;

    let isClinicanCode = await facilityOtp.findOne({ clinicanCode: connect });

    if (isClinicanCode) {
      let createMedicalService = await medicalPractice.create({
        patients: _id,
        facilityOwners: isClinicanCode.corporateId,
      });

      await createMedicalService.save();

      res.status(200).json('Connected');
    } else {
      res.status(400).json('Code Not Found');
    }
  } catch (error) {
    next(error);
  }
};

//generate random 4 digits Otp
const generateOTP = async () => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let otp = '';

  for (let i = 0; i < 4; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    otp += characters.charAt(randomIndex);
  }

  return otp;
};

//sending email

var google = require('googleapis').google;
var OAuth2 = google.auth.OAuth2;
// const OAuth2 = require('google-auth-library').OAuth2;
// const nodemailer = require('nodemailer');

const oauth2Client = new OAuth2(
  '276616160743-r47qv2h7idomeuijehg6971iulbjl2e1.apps.googleusercontent.com',
  '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',
  'https://developers.google.com/oauthplayground'
);
oauth2Client.setCredentials({
  refresh_token:
    '1//04FEXZyHan0_dCgYIARAAGAQSNwF-L9Ir0jm-8dg6iU8yCI-miZTASosb5SBxHP0kacVa8k3XQi0mmuNGtNlex1R70OaYTo0crzI',
});

const createTransporter = async () => {
  try {
    const accessToken = await new Promise((resolve, reject) => {
      oauth2Client.getAccessToken((err, token) => {
        if (err) {
          reject('Failed to create access token: ' + err);
        } else {
          resolve(token);
        }
      });
    });

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: 'ns265331@gmail.com',
        accessToken,
        clientId:
          '276616160743-r47qv2h7idomeuijehg6971iulbjl2e1.apps.googleusercontent.com',
        clientSecret: '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',
        refreshToken:
          '1//04FEXZyHan0_dCgYIARAAGAQSNwF-L9Ir0jm-8dg6iU8yCI-miZTASosb5SBxHP0kacVa8k3XQi0mmuNGtNlex1R70OaYTo0crzI',
      },
      tls: {
        rejectUnauthorized: false, // Add this line to disable certificate verification
      },
    });

    return transporter;
  } catch (error) {
    // Handle the error here
    console.error('Error creating transporter:', error);
    throw new Error('Failed to create transporter');
  }
};

const mailer = async (to, otp) => {
  const transporter = await createTransporter();

  const mailOptions = {
    from: 'healthcare@aineurocare.com',
    to,
    subject: 'OTP for Login - NeuroCare AI',
    html: `<p>Dear ${to.split('@')[0]},</p>

    <p>Your OTP for login to NeuroCare AI is: <strong>${otp}</strong></p>

    <p>Regards,</p>
    <p>Admin</p>`,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
};

module.exports = {
  changePasswordController,
  deleteUserController,
  sendEmail,
  verifyEmail,
  verifyOtp,
  forgotPasswordController,
  updatedUser,
  userInfoController,
  verifyforgetPasswordOtp,
  allUsers,
  patApplyforcoroporate,
  getPatApplyService,
  specificCorporateData,
  isAdminApprovePatientService,
  getAllCorporates,
  updatedProfile,
  toConnectCorporate,
};

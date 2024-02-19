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
const noOfCallsMade = require('../Model/noOfCallsMade');
const FcmNotify = require('../utils/fcmNotify');
const Notification = require('../Model/notiHistoryModel');
const generateRandomNo = require('../utils/generatingRandomNo');
const EmailSender = require('../utils/email');

// const { Console } = require('console');

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
      let [data, findOtp] = await Promise.all([
        Corporate.find({ _id }).lean(),
        facilityOtp.find({ corporateId: _id }).lean(),
      ]);

      let combinedArray = [...data, ...findOtp];
      res.status(200).json(combinedArray);
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

const userInfoNameController = async (req, res, next) => {
  try {
    const { _id, isAdmin } = req.user;

    if (isAdmin === 'corporate') {
      
      const corporate=await Corporate.findOne({ _id })
      

      res.status(200).json({organizationName:corporate.organizationName});
    } 
     else {
      throw new ErrorHandler('Invalid Role', 400);
    }
  } catch (err) {
    next(err);
  }
};

//corporate data
const specificCorporateData = async (req, res, next) => {
  try {
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

//verifyOtp
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

//sendEmail

const sendEmail = async (req, res, next) => {
  try {
    // if (role === 'patient') {
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
    // } else if (role === 'care-givers') {
    //   let data = await User.findOne({ email: req.body.email });

    //   if (data) {
    //     const otpCode = '0123456789';
    //     let result;
    //     async function generateRandomString(length) {
    //       result = '';
    //       let charactersLength = otpCode.length;
    //       for (let i = 0; i < length; i++) {
    //         result += otpCode.charAt(
    //           crypto.randomBytes(1)[0] % charactersLength
    //         );
    //       }
    //     }
    //     generateRandomString(4);
    //     // let otpCode = Math.floor((Math.random()*10000) + 1);
    //     let otpData = new Otp({
    //       email: req.body.email,
    //       code: result,
    //       expiresIn: new Date(Date.now() + 60000),
    //       // expiresIn: new Date().getTime() + 0.002 * 1000
    //     });
    //     let otpResponse = await otpData.save();
    //     res.status(200).json({ msg: 'Please Check Your Email' });
    //     mailer(req.body.email, otpResponse.code);
    //   } else {
    //     throw new ErrorHandler('Your email id doesnot exist in db', 400);
    //   }
    // } else {
    // }
  } catch (error) {
    next(error);
  }
};

//verifyForgetPasswordOtp
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
    const allUsers = await User.find().select(
      '-isVerified -profileId -profile -isSocialMediaAuth -isAdminApprove -isProfileCompleted -createdAt -password -updatedAt -__v'
    );
    res.status(200).json(allUsers);
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
      registeredPatId,
      registeredSuperAdminId,
      registeredCorporateId,
    } = req.body;

    // Create a new instance of the Mongoose model

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
      registeredPatId,
      registeredSuperAdminId,
      registeredCorporateId,
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

    getSuperAdminfcmToken.forEach((token) => {
      if (token.fcmToken) {
        token.fcmToken.map((fcmToken) => {
          if (fcmToken) {
            FcmNotify(fcmToken, notificationData, 'super-admin');
          }
        });
      }
    });

    res.status(201).json({
      message: 'Request Submitted Successfully',
      application: savedApplication,
    });
  } catch (err) {
    next(err);
  }
};

//getpatapplyservicefor patient to view his own request

const getpatrequest = async (req, res, next) => {
  try {
    const { _id, isAdmin } = req.user;

    let patServices;
    isAdmin === 'patient'
      ? (patServices = await patService
          .find({ registeredPatId: _id })
          .lean()
          .sort({ createdAt: -1 }))
      : isAdmin === 'super-admin'
      ? (patServices = await patService
          .find({ registeredSuperAdminId: _id })
          .lean()
          .sort({ createdAt: -1 }))
      : isAdmin === 'corporate'
      ? (patServices = await patService
          .find({ registeredCorporateId: _id })
          .lean()
          .sort({ createdAt: -1 }))
      : '';
    res.status(200).json(patServices);
  } catch (err) {
    next(err);
  }
};

//superAdminViewing the data patApplyService

const getPatApplyService = async (req, res, next) => {
  try {
    const patServices = await patService.find().lean().sort({ createdAt: -1 });
    res.status(200).json(patServices);
  } catch (err) {
    next(err);
  }
};

//<----------------------------is admin approve patienapply service Start------------------------------->

const isAdminApprovePatientService = async (req, res, next) => {
  try {
    const { patMongoId } = req.params;
    const updatedData = await patService.findByIdAndUpdate(
      patMongoId,
      { isAdminApproveStatus: true },
      { new: true }
    );

    //if data is found else send message no data found
    if (updatedData) {
      const existEmail = await Corporate.find({
        organizationContactNo: updatedData.servicePhoneNumber,
      });

      //increase number
      if (existEmail.length !== 0) {
        let corporate = await Corporate.findOneAndUpdate(
          { organizationContactNo: updatedData.servicePhoneNumber },
          { $inc: { conatactedCustomer: 1 } },
          { new: true }
        );

        //<-------------------------invoice flow start here -------------------------->

        //genearate random invoice id
        async function generateInvoiceId() {
          let otp;
          let isUnique = false;
          let randomNoGenerator = new generateRandomNo(5);

          while (!isUnique) {
            otp = randomNoGenerator.generate10RandomNo();
            // otp = await generateInvoiceOtp();
            const existingOtp = await invoice.findOne({
              invoiceId: otp,
            });

            if (!existingOtp) {
              isUnique = true;
            }
          }
          return otp;
        }

        const invoiceId = await generateInvoiceId();
        //generate invoice

        let createInvoie = await invoice.create({
          category: corporate.category,
          leadsId: corporate.mongoDbID,
          patientId: updatedData._id,
          corporateId: corporate._id,
          leadAmount: req.body.leadAmount,
          subTotal: req.body.subTotal,
          payableAmount: req.body.grandTotal,
          discount: req.body.discount,
          dueDate: req.body.dueDate,
          additionalMessage: req.body.additionalMessage,
          invoiceId,
        });

        await createInvoie.save();

        //<-------------------------invoice flow start here -------------------------->

        //<-------------------------notification flow start here -------------------------->

        //notification Body
        const notificationData = 'You get the new leads';

        //save notification history

        let saveNotiHistory = await Notification.create({
          title: 'Patient Requested',
          Notification: notificationData,
          type: 'corporate',
          corporateId: corporate._id,
        });

        await saveNotiHistory.save();

        //save notification history

        //if fcm token send notification to corporate
        if (corporate.fcmToken) {
          corporate.fcmToken.map((token) => {
            if (token && token.trim() !== '') {
              FcmNotify(token, notificationData, 'corporate');
            }
          });
        }

        //<-------------------------notification flow end here -------------------------->

        //<-------------------------Send Email to User start -------------------------->

        const emailOptions = {
          to: updatedData.patEmail,
          subject: 'Your Health Service Request is Underway',
          html: `
            <p>Dear ${updatedData.patFullName},</p>

            <p>
              We are pleased to inform you that your health service request has
              been successfully received and forwarded to the ${updatedData.serviceName}.
            </p>
            <p>
              Facility Details 
              Name: ${updatedData.serviceName}
              City: ${updatedData.serviceCity}
              Address : ${updatedData.serviceFullAddress}
              Zip Code : ${updatedData.serviceZipCode}
              State : ${updatedData.serviceState}
            </p>

            <p>
              The facility owner will be in touch with you as soon as possible
              to discuss your specific requirements and preferences. If you have
              any immediate questions or if there's anything specific you would
              like to share, please Contact Our Customer Support.
            </p>

            <p>
              Your well-being is our top priority, and our team is here to
              assist you.
            </p>

            <p>
              Thank you for choosing our health services. Your trust means the
              world to us.
            </p>

            <p>
              Warm regards,<br />
              Best Health Service Team
            </p>

            <img
              src="https://healthcare-assets.s3.amazonaws.com/final+logo.jpg"
              alt="Company Logo" width="150" height="150"
            />
          `,
        };

        await EmailSender(emailOptions);

        //<-------------------------Send Email to User End -------------------------->

        res.status(200).json({ message: 'Updated', data: updatedData });
      } else {
        //<-------------------------corporate flow start here -------------------------->

        //create facilty ownere records if corporate not exist
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

        //save corporate
        let corporate = await createUser.save();

        //<-------------------------corporate flow end here -------------------------->

        //<-------------------------invoice flow start here -------------------------->

        //genearate random invoice id
        async function generateInvoiceId() {
          let otp;
          let isUnique = false;

          let randomNoGenerator = new generateRandomNo(5);

          while (!isUnique) {
            otp = randomNoGenerator.generate10RandomNo();
            // otp = await generateInvoiceOtp();
            const existingOtp = await invoice.findOne({
              invoiceId: otp,
            });

            if (!existingOtp) {
              isUnique = true;
            }
          }
          return otp;
        }

        const invoiceId = await generateInvoiceId();

        let createInvoie = await invoice.create({
          category: corporate.category,
          leadsId: corporate.mongoDbID,
          patientId: updatedData._id,
          corporateId: corporate._id,
          leadAmount: req.body.leadAmount,
          subTotal: req.body.subTotal,
          payableAmount: req.body.grandTotal,
          discount: req.body.discount,
          dueDate: req.body.dueDate,
          additionalMessage: req.body.additionalMessage,
          invoiceId,
        });

        //save invoice
        await createInvoie.save();

        //<-------------------------invoice flow end here -------------------------->

        //<-------------------------facility otp flow start here -------------------------->

        //generate unique otp for facility to connect
        async function generateUniqueOTP() {
          let otp;
          let isUnique = false;
          //<-------------------- object instance------------------------->
          let obj = new generateRandomNo(4);

          while (!isUnique) {
            // otp = await generateOTP();
            otp = obj.generateOtp();
            const existingOtp = await facilityOtp.findOne({
              clinicanCode: otp,
            });

            if (!existingOtp) {
              isUnique = true;
            }
          }
          return otp;
        }

        //generate otp
        const otp = await generateUniqueOTP();

        //create otp in the model
        const createFacilityOtp = await facilityOtp.create({
          corporateId: corporate._id,
          clinicanCode: otp,
        });

        //save otp
        await createFacilityOtp.save();

        //<-------------------------facility otp flow end here -------------------------->

        //<----------------------send email to user-------------------------------------->

        const emailOptions = {
          to: updatedData.patEmail,
          subject: 'Your Health Service Request is Underway',
          html: `
            <p>Dear ${updatedData.patFullName},</p>

            <p>
              We are pleased to inform you that your health service request has
              been successfully received and forwarded to the ${updatedData.serviceName}.
            </p>

            <p>
              Facility Details 
              Name: ${updatedData.serviceName}
              City: ${updatedData.serviceCity}
              Address : ${updatedData.serviceFullAddress}
              Zip Code : ${updatedData.serviceZipCode}
              State : ${updatedData.serviceState}
            </p>

            <p>
              The facility owner will be in touch with you as soon as possible
              to discuss your specific requirements and preferences. If you have
              any immediate questions or if there's anything specific you would
              like to share, please Contact Our Customer Support.
            </p>

            <p>
              Your well-being is our top priority, and our team is here to
              assist you.
            </p>

            <p>
              Thank you for choosing our health services. Your trust means the
              world to us.
            </p>

            <p>
              Warm regards,<br />
              Best Health Service Team
            </p>

            <img
              src="https://healthcare-assets.s3.amazonaws.com/final+logo.jpg"
              alt="Company Logo" width="200" height="200"
            />
          `,
        };

        await EmailSender(emailOptions);

        res.status(200).json({ message: 'Updated', data: updatedData });
      }
    } else {
      res.status(200).json({ success: false, message: 'No Data Found' });
    }
  } catch (err) {
    next(err);
  }
};

//<----------------------------is admin approve patienapply service End------------------------------->

//Super Admin getting all the corporates data which are coming from scrapping

const getAllCorporates = async (req, res, next) => {
  try {
    const getAllCorporatesData = await Corporate.find({
      isCreatedByProperRegisteration: false,
    }).sort({ _id: -1 });

    // const apiUrl =
    //   'http://hc-scrapted-data.eba-pmas6jv8.ap-south-1.elasticbeanstalk.com/api/healthCareRoute/getCorporatesUsingMongoId';

    const apiUrl = process.env.apiUrl;

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
      throw new ErrorHandler('Clinican Code Not Found', 400);
    }
  } catch (error) {
    next(error);
  }
};

//<---------------------------no in use start-------------------------------------->
//generate random 4 digits Otp
const generateOTP = async () => {
  const characters = 'ABCDEFGHIJKLMNPQRSTUVWXYZ123456789';
  let otp = '';

  for (let i = 0; i < 4; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    otp += characters.charAt(randomIndex);
  }

  return otp;
};

const generateInvoiceOtp = async () => {
  const alphabeticCharacters = 'ABCDEFGHIJKLMNPQRSTUVWXYZ';
  const numericDigits = '0123456789';

  let otp = '';

  // Generate the first 5 alphabetic characters
  for (let i = 0; i < 5; i++) {
    const randomIndex = Math.floor(Math.random() * alphabeticCharacters.length);
    otp += alphabeticCharacters.charAt(randomIndex);
  }

  // Generate the last 5 numeric digits
  for (let i = 0; i < 5; i++) {
    const randomIndex = Math.floor(Math.random() * numericDigits.length);
    otp += numericDigits.charAt(randomIndex);
  }

  return otp;
};

//<---------------------------no in use End-------------------------------------->

const noOfCallsMadeMethod = async (req, res, next) => {
  try {
    let { _id } = req.user;
    const { patientId, callDetails, emailDetails } = req.body;

    const isExist = await noOfCallsMade.findOne({
      patientId,
      corporateId: _id,
    });

    if (isExist) {
      if (callDetails) {
        const fromValue = callDetails[0].from;

        // Check if the document exists first
        const isExist = await noOfCallsMade.findOne({
          patientId,
          corporateId: _id,
          'callDetails.from': fromValue,
        });

        if (isExist) {
          await noOfCallsMade.findOneAndUpdate(
            {
              patientId,
              corporateId: _id,
              'callDetails.from': fromValue,
            },
            {
              $inc: { 'callDetails.$.noOfCounts': 1 },
            }
          );

          return res.status(200).json({
            success: true,
            message: 'Record Updated',
          });
        }
      } else if (emailDetails) {
        const fromValue = emailDetails[0].from;

        // Check if the document exists first
        const isExist = await noOfCallsMade.findOne({
          patientId,
          corporateId: _id,
          'emailDetails.from': fromValue,
        });

        if (isExist) {
          await noOfCallsMade.findOneAndUpdate(
            {
              patientId,
              corporateId: _id,
              'emailDetails.from': fromValue,
            },
            {
              $inc: { 'emailDetails.$.noOfCounts': 1 },
            }
          );

          return res.status(200).json({
            success: true,
            message: 'Record Updated',
          });
        }
      }
    } else {
      let createData = {
        patientId,
        corporateId: _id,
        callDetails: [],
        emailDetails: [],
      };

      if (callDetails) {
        if (callDetails[0].from === 'WEB') {
          createData.callDetails.push({
            from: 'WEB',
            noOfCounts: 1,
          });

          createData.callDetails.push({
            from: 'MOBILE',
            noOfCounts: 0,
          });

          //email detail will be initalized with 0 by default

          createData.emailDetails.push({
            from: 'WEB',
            noOfCounts: 0,
          });

          createData.emailDetails.push({
            from: 'MOBILE',
            noOfCounts: 0,
          });
        } else if (callDetails[0].from === 'MOBILE') {
          createData.callDetails.push({
            from: 'WEB',
            noOfCounts: 0,
          });

          createData.callDetails.push({
            from: 'MOBILE',
            noOfCounts: 1,
          });

          //email detail will be initalized with 0 by default
          createData.emailDetails.push({
            from: 'WEB',
            noOfCounts: 0,
          });

          createData.emailDetails.push({
            from: 'MOBILE',
            noOfCounts: 0,
          });
        }
      }

      if (emailDetails) {
        if (emailDetails[0].from === 'WEB') {
          createData.emailDetails.push({
            from: 'WEB',
            noOfCounts: 1,
          });

          createData.emailDetails.push({
            from: 'MOBILE',
            noOfCounts: 0,
          });

          //call details will be initialized with 0 by default
          createData.callDetails.push({
            from: 'WEB',
            noOfCounts: 0,
          });

          createData.callDetails.push({
            from: 'MOBILE',
            noOfCounts: 1,
          });
        } else if (emailDetails[0].from === 'MOBILE') {
          createData.emailDetails.push({
            from: 'WEB',
            noOfCounts: 0,
          });

          createData.emailDetails.push({
            from: 'MOBILE',
            noOfCounts: 1,
          });

          //call details will be initialized with 0 by default
          createData.callDetails.push({
            from: 'WEB',
            noOfCounts: 0,
          });

          createData.callDetails.push({
            from: 'MOBILE',
            noOfCounts: 1,
          });
        }
      }

      const createNoOfCallsMade = await noOfCallsMade.create(createData);
      await createNoOfCallsMade.save();
      return res.status(200).json('Record Created');
    }
  } catch (error) {
    next(error);
  }
};

//medicalPracticeForEachIndividualPatient
const getMedicalPracticeForIndividualUser = async (req, res, next) => {
  try {
    const { _id, isAdmin } = req.user;
    const { category } = req.body;
    const scrapedResponsesByCategory = {};
    const scrapedResponsesByAll = [];

    const apiUrl =
      // 'http://localhost:3000/api/healthCareRoute/getCorporatesUsingMongoId';
      'http://hc-scrapted-data.eba-pmas6jv8.ap-south-1.elasticbeanstalk.com/api/healthCareRoute/getCorporatesUsingMongoId';

    if (isAdmin === 'patient') {
      if (category === 'professional') {
        const foundMedicalPractice = await medicalPractice
          .find({ patients: _id })
          .populate('facilityOwners');

        const scrapedResponses = await Promise.all(
          foundMedicalPractice.map(async (item) => {
            const scrapedResponse = await axios.post(apiUrl, {
              mongoDbID: item.facilityOwners.mongoDbID, // Use the relevant field here
              category: item.facilityOwners.category,
            });

            const category = item.facilityOwners.category;

            // Check if the category exists in the object, and create it if not
            if (!scrapedResponsesByCategory[category]) {
              scrapedResponsesByCategory[category] = [];
            }

            // Add the scraped data to the appropriate category
            scrapedResponsesByCategory[category].push(scrapedResponse.data);

            return scrapedResponse.data;
          })
        );

        if (scrapedResponsesByCategory.professional) {
          res.status(200).json(scrapedResponsesByCategory.professional);
        } else {
          res.status(200).json([]);
        }

        // res.status(200).json(scrapedResponses);
        // }
      } else if (category === 'all') {
        const foundMedicalPractice = await medicalPractice
          .find({ patients: _id })
          .populate('facilityOwners');

        const scrapedResponses = await Promise.all(
          foundMedicalPractice.map(async (item) => {
            const scrapedResponse = await axios.post(apiUrl, {
              mongoDbID: item.facilityOwners.mongoDbID, // Use the relevant field here
              category: item.facilityOwners.category,
            });

            const category = item.facilityOwners.category;

            // Check if the category exists in the object, and create it if not
            if (!scrapedResponsesByCategory[category]) {
              scrapedResponsesByCategory[category] = [];
            }

            // Add the scraped data to the appropriate category
            if (category !== 'professional') {
              scrapedResponsesByAll.push(scrapedResponse.data);
            }
            return scrapedResponse.data;
          })
        );

        // const { professional, ...scrapedResponsesByCategory } =
        //   scrapedResponsesByCategory;
        // res.status(200).json(scrapedResponses);
        // delete scrapedResponsesByCategory.professional;

        res.status(200).json(scrapedResponsesByAll);
      }
    }
  } catch (err) {
    next(err);
  }
};

//sending email
var google = require('googleapis').google;
var OAuth2 = google.auth.OAuth2;
// const OAuth2 = require('google-auth-library').OAuth2;
// const nodemailer = require('nodemailer');

const oauth2Client = new OAuth2(
  '314005293340-9eh88g6318enm271d5ti60538lfsr43k.apps.googleusercontent.com',
  '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',
  'https://developers.google.com/oauthplayground'
);
oauth2Client.setCredentials({
  refresh_token:
    '1//04AOWCmqvdobSCgYIARAAGAQSNwF-L9Ire2LiZhFn3OUK8x00E38RLeEbC37vCdhtQAwcpXq0Sc5B8lKDgqxn5-bdcYd6wSG_fv0',
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
        user: 'maazurrehman42@gmail.com',
        accessToken,
        clientId:
          '314005293340-9eh88g6318enm271d5ti60538lfsr43k.apps.googleusercontent.com',
        clientSecret: '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',
        refreshToken:
          '1//04AOWCmqvdobSCgYIARAAGAQSNwF-L9Ire2LiZhFn3OUK8x00E38RLeEbC37vCdhtQAwcpXq0Sc5B8lKDgqxn5-bdcYd6wSG_fv0',
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
    from: 'HealthCare@gmail.com',
    to,
    subject: 'OTP - HealthCare',
    html: `<p>Dear ${to.split('@')[0]},</p>

    <p>Your OTP for login to HealthCare is: <strong>${otp}</strong></p>

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
  noOfCallsMadeMethod,
  getMedicalPracticeForIndividualUser,
  getpatrequest,
  userInfoNameController
};

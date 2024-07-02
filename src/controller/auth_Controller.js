const User = require('../Model/User');
const otherCare = require('../Model/otherCareModel');
const Corporate = require('../Model/corporateModel');
const superAdmin = require('../Model/superAdminModel');
const Advisor = require('../Model/advisorModel');
const jwt = require('jsonwebtoken');
const ErrorHandler = require('../utils/ErrorHandler');
const Otp = require('../Model/Otp');
const nodemailer = require('nodemailer');
const CryptoJS = require('crypto-js');
const crypto = require('crypto');
const { default: axios } = require("axios");
const notificationModel = require('../Model/notificationModel');
const registerController = async (req, res, next) => {

  try {



    const { email, password, confirmPass, role } = req.body;

    if (role === 'patient') {
      // Check if email already exists in the database
      if (password !== confirmPass) {
        throw new ErrorHandler(
          'Password and confirm password are not same',
          400
        );
      }
      const existEmail = await User.find({ email: email });
      if (existEmail.length === 0) {
        // Create a new user with encrypted password
        const isApprovedbyAdmin = role === 'patient' ? true : false;
        const savedUser = await User.create({
          email,
          password: CryptoJS.AES.encrypt(
            password,
            process.env.PASS_SEC
          ).toString(),
          role,
          isApprovedbyAdmin,
        });

        //sending email

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
      } else if (existEmail.length > 0) {
        if (existEmail[0].isOtpVerified === false) {
          await User.deleteOne({ email: email });

          // Create a new user with encrypted password
          const isApprovedbyAdmin = role === 'patient' ? true : false;

          const savedUser = await User.create({
            email,
            password: CryptoJS.AES.encrypt(
              password,
              process.env.PASS_SEC
            ).toString(),
            role,
            isApprovedbyAdmin,
          });

          //sending email

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
          throw new ErrorHandler('This e-mail is already in use!', 400);
        }

        //role for other care
      }
    } else if (role === 'care-givers') {
      // Check if email already exists in the database
      if (password !== confirmPass) {
        throw new ErrorHandler(
          'Password and confirm password are not same',
          400
        );
      }
      const existEmail = await otherCare.find({ email: email });
      if (existEmail.length === 0) {
        // Create a new user with encrypted password
        const isApprovedbyAdmin = role === 'patient' ? true : false;
        const savedUser = await otherCare.create({
          email,
          password: CryptoJS.AES.encrypt(
            password,
            process.env.PASS_SEC
          ).toString(),
          role,
          isApprovedbyAdmin,
        });

        //sending email

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
      } else if (existEmail.length > 0) {
        if (existEmail[0].isOtpVerified === false) {
          await otherCare.deleteOne({ email: email });

          // Create a new user with encrypted password
          const isApprovedbyAdmin = role === 'patient' ? true : false;

          const savedUser = await otherCare.create({
            email,
            password: CryptoJS.AES.encrypt(
              password,
              process.env.PASS_SEC
            ).toString(),
            role,
            isApprovedbyAdmin,
          });

          //sending email

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
          throw new ErrorHandler('This e-mail is already in use!', 400);
        }

        //role for other care
      }
    } else if (role === 'corporate') {
      // Check if email already exists in the database
      if (password !== confirmPass) {
        throw new ErrorHandler(
          'Password and confirm password are not same',
          400
        );
      }
      const existEmail = await Corporate.find({ email: email });
      if (existEmail.length === 0) {
        // Create a new user with encrypted password
        const isApprovedbyAdmin = role === 'patient' ? true : false;
        const savedUser = await Corporate.create({
          email,
          password: CryptoJS.AES.encrypt(
            password,
            process.env.PASS_SEC
          ).toString(),
          role,
          isApprovedbyAdmin,
        });

        //sending email

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
      } else if (existEmail.length > 0) {
        if (existEmail[0].isOtpVerified === false) {
          await Corporate.deleteOne({ email: email });

          // Create a new user with encrypted password
          const isApprovedbyAdmin = role === 'patient' ? true : false;

          const savedUser = await Corporate.create({
            email,
            password: CryptoJS.AES.encrypt(
              password,
              process.env.PASS_SEC
            ).toString(),
            role,
            isApprovedbyAdmin,
          });

          //sending email

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
          throw new ErrorHandler('This e-mail is already in use!', 400);
        }

        //role for other care
      }
    } else if (role === 'super-admin') {
      if (password !== confirmPass) {
        throw new ErrorHandler(
          'Password and confirm password are not same',
          400
        );
      }
      const existEmail = await superAdmin.find({ email: email });
      if (existEmail.length === 0) {
        const savedUser = await superAdmin.create({
          email,
          password: CryptoJS.AES.encrypt(
            password,
            process.env.PASS_SEC
          ).toString(),
          role,
          firstName: req.body.firstName,
          middleName: req.body.middleName,
          lastName: req.body.lastName,
          phoneNumber: req.body.phoneNumber,
          dateOfBirth: req.body.dateOfBirth,
          gender: req.body.gender,
          region: req.body.region,
          state: req.body.state,
          city: req.body.city,
          zipCode: req.body.zipCode,
        });

        res.status(201).json(savedUser);
      } else {
        throw new ErrorHandler('This e-mail is already in use!', 400);
      }

      //role for other care
    }
  } catch (err) {
    next(err);
  }
};

const registerWithSocialMedia = async (req, res, next) => {
  try {
    const { email, profilePic, profileId, firstName, lastName}=req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      const notification=await notificationModel.create({
        email:email,
        message:"Login Successfull",

      })

        const accessToken = generateAccessToken(existingUser);
        res.status(200).json({ email: existingUser.email, accessToken });
    } else {
        const newUser = await User.create({
            email,
            role: "patient",
            profileId,
            firstName,
            lastName,
            profilePic,
            isOtpVerified: true,
            isSocialMediaAuth: true,
        });

        // const notification=await notificationModel.create({
        //   email:email,
        //   message:"Login Successfull",
  
        // })
        const accessToken = generateAccessToken(newUser);

        const { password: _, email: newEmail, ...userWithoutPassword } = newUser._doc;

        res.status(201).json({ email: newEmail, accessToken });
    }
} catch (error) {
    // Log or handle the error appropriately
    next(error);
}


};


// const registerWithSocialMedia = async (req, res, next) => {
//   try {


//     const user = req.user

//     const existingUser = await User.findOne({ email: user.email });

//     if (existingUser) {
//       return res.status(409).json("User Already Exists");
//     }


//     let role = 'patient'

//     const savedUser = await User.create({
//       email: user.email,
//       role,
//       isOtpVerified: true
//     });


//     return res.status(200).json("User successfully signed up")




//   }
//   catch (error) {
//     next(error);
//   }
// };

// const loginWithSocialMedia = async (req, res, next) => {
//   try {

//     const user = req.user

//     const existingUser = await User.findOne({ email: user.email });


//     if (!existingUser) {
//       const savedUser = await User.create({
//         email: user.email,
//         role: "patient",
//         isOtpVerified: true
//       });
//       const accessToken = generateAccessToken(savedUser);
      
//       const { password: _, role, email,isVital, ...others } = savedUser._doc; // Exclude password from response

//       // const isVital = vitals.length > 0 ? vitals[0].isVital : false;
      
//       res.status(200).json({ accessToken, role, email,isVital });
//       console.log("if block chala")


//     }
//     else {

//       const deleteUser = await User.deleteOne({ email: existingUser.email })
//       const savedUser = await User.create({
//         email: user.email,
//         role: "patient",
//         isOtpVerified: true
//       });
//       const accessToken = generateAccessToken(savedUser);

//       const { password: _, role, email,isVital, ...others } = savedUser._doc; // Exclude password from response

//       // const isVital = vitals.length > 0 ? vitals[0].isVital : false;
//       // console.log("else if block chala")
//       res.status(200).json({ accessToken, role, email,isVital });

//     }
//   }
//   catch (err) {
//     next(err)
//   }
// }

const loginController = async (req, res, next) => {
  try {
    const { email, password, role } = req.body;

      // console.log(req.body,"body")

    if (role === 'patient') {

      // console.log(req.body,"body")
      const user = await User.findOne({ email });

      if (!user || !isPasswordValid(user.password, password)) {
        // User not found or wrong password
        throw new ErrorHandler('Wrong Credentials', 401);
        // res.status(401).json("Wrong Credentials");
        // return;
      }
      const notification=await notificationModel.create({
        email:email,
        message:"Login Successfull",

      })
      // console.log(notification)
      const accessToken = generateAccessToken(user);
      // console.log(accessToken)

      const { password: _, role, isVital, ...others } = user._doc; // Exclude password from response

      // const isVital = vitals.length > 0 ? vitals[0].isVital : false;

      res.status(200).json({ accessToken, role, isVital });
    } else if (role === 'care-givers') {
      const user = await otherCare.findOne({ email });

      if (!user || !isPasswordValid(user.password, password)) {
        // User not found or wrong password
        throw new ErrorHandler('Wrong Credentials', 401);
        // res.status(401).json("Wrong Credentials");
        // return;
      }

      const accessToken = generateAccessToken(user);

      const { password: _, role, ...others } = user._doc; // Exclude password from response

      // const isVital = vitals.length > 0 ? vitals[0].isVital : false;

      res.status(200).json({ accessToken, role });
    } else if (role === 'corporate') {
      const user = await Corporate.findOne({ email });

      if (!user || !isPasswordValid(user.password, password)) {
        // User not found or wrong password
        throw new ErrorHandler('Wrong Credentials', 401);
        // res.status(401).json("Wrong Credentials");
        // return;
      }

      const accessToken = await generateAccessToken(user);

      const { password: _, role, ...others } = user._doc;

      res.status(200).json({ accessToken, role, email });
    } else if (role === 'manager') {
      const user = await Corporate.findOne({ email });

      if (!user || !isPasswordValid(user.password, password)) {
        throw new ErrorHandler('Wrong Credentials', 401);
      }

      const accessToken = generateAccessToken(user);

      const { password: _, role, ...others } = user._doc;

      res.status(200).json({ accessToken, role });
    } else if (role === 'super-admin') {
      const user = await superAdmin.findOne({ email });

      if (!user || !isPasswordValid(user.password, password)) {
        throw new ErrorHandler('Wrong Credentials', 401);
      }

      const accessToken = generateAccessToken(user);

      const { password: _, role, ...others } = user._doc;

      res.status(200).json({ accessToken, role });
    }
  } catch (error) {
    next(error);
  }
};




//corporate s

const isPasswordValid = (encryptedPassword, password) => {
  const hashedPassword = CryptoJS.AES.decrypt(
    encryptedPassword,
    process.env.PASS_SEC
  );
  const originalPassword = hashedPassword.toString(CryptoJS.enc.Utf8);
  return originalPassword === password;
};

const generateAccessToken = (user) => {
  return jwt.sign(
    {
      _id: user._id,
      isAdmin: user.role,
    },
    process.env.JWT_SEC,
    // { expiresIn: '' } no limit
  );
};

// const userDataController=async(req,res,next)=>{
//   try{



//   }
//   catch(err){

//   }
// }

//sending email

var google = require('googleapis').google;
var OAuth2 = google.auth.OAuth2;
// const OAuth2 = require('google-auth-library').OAuth2;
// const nodemailer = require('nodemailer');

const oauth2Client = new OAuth2(
  '339736576493-6f2m4bhr51oddu81foqnvqema7a34d0t.apps.googleusercontent.com',
  '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',
  'https://developers.google.com/oauthplayground'
);
oauth2Client.setCredentials({
  refresh_token:
    '1//04ZPgPMNGNQdBCgYIARAAGAQSNwF-L9Ir030qDFXi9jl8D4aJIjeiZ3IftGjGxUTQ4MRSpTlBaX0CLEHBUThEcY7ylx9GFUzhMlw',
});


oauth2Client.setCredentials({
  refresh_token: "1//04ZPgPMNGNQdBCgYIARAAGAQSNwF-L9Ir030qDFXi9jl8D4aJIjeiZ3IftGjGxUTQ4MRSpTlBaX0CLEHBUThEcY7ylx9GFUzhMlw",
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
        user: 'healthcareinfoamerican@gmail.com',
        accessToken,
        clientId:
          '339736576493-6f2m4bhr51oddu81foqnvqema7a34d0t.apps.googleusercontent.com',
        clientSecret: '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',
        refreshToken:
          '1//04ZPgPMNGNQdBCgYIARAAGAQSNwF-L9Ir030qDFXi9jl8D4aJIjeiZ3IftGjGxUTQ4MRSpTlBaX0CLEHBUThEcY7ylx9GFUzhMlw',
      },
      tls: {
        rejectUnauthorized: false, // Add this line to disable certificate verification
      },
    });

    return transporter;
  } catch (error) {
    // Handle the error here
    // console.error('Error creating transporter:', error);
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
  registerController,
  loginController,
  registerWithSocialMedia,

};

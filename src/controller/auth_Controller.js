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
    const { email, profile, profileId, firstName } = req.body;

    // Check if the user with the given profileId already exists
    const existingUser = await User.findOne({ profileId });

    if (existingUser) {
      // User with the same profileId already exists
      // Generate JWT token for the existing user
      const accessToken = generateAccessToken(existingUser);

      // Send the response with the access token
      res.status(200).json({ existingUser, accessToken });
    } else {
      // Create a new user with the Google registration
      const newUser = await User.create({
        email,
        profileId,
        profile,
        firstName,
        isSocialMediaAuth: true,
      });

      // Generate JWT token for the newly registered user
      const accessToken = generateAccessToken(newUser);

      // Exclude sensitive information (like password) from the response
      const { password: _, ...userWithoutPassword } = newUser._doc;

      // Send the response with the user data and access token
      res.status(201).json({ ...userWithoutPassword, accessToken });
    }
  } catch (error) {
    next(error);
  }
};

const loginController = async (req, res, next) => {
  try {
    const { email, password, role } = req.body;

    if (role === 'patient') {
      const user = await User.findOne({ email });

      if (!user || !isPasswordValid(user.password, password)) {
        // User not found or wrong password
        throw new ErrorHandler('Wrong Credentials', 401);
        // res.status(401).json("Wrong Credentials");
        // return;
      }

      const accessToken = generateAccessToken(user);

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
    { expiresIn: '' }
  );
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

require("dotenv").config();
const nodemailer = require("nodemailer");

const createTransporter = async () => {




const transporter = nodemailer.createTransport({
    host: 'infosenior.care',
    port: 465,
    secure: true,
    auth: {

      user: 'partnerships@infosenior.care', 
      pass: 'Matzsolu1@2345', 


    },
    debug: true
  });

  return transporter;
};




const sendEmailForFacility = async ({ to, subject, text, html, res }) => {
  try {
    const emailTransporter = await createTransporter();
    const emailOptions = {
      from: "partnerships@infosenior.care",
      to,
      subject,
      text,
      html,
    };

    return new Promise((resolve, reject) => {
      emailTransporter.sendMail(emailOptions, (err, info) => {
        if (err) {
          console.log(err);
          reject(err); // Notify caller about the failure
        } else {
          console.log("Email sent:", info.response);
          resolve(true); // Notify caller about successful email sending
        }
      });
    });
  } catch (err) {
    console.log(err);
    return false; // Return false to indicate failure
  }
};

module.exports = sendEmailForFacility;

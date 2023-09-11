const admin = require('firebase-admin');
const serviceAccount = require('../utils/healthcare-f8e9b-firebase-adminsdk-3rc82-ab38bc6b10.json');

process.env.GOOGLE_APPLICATION_CREDIENTIALS;

function FcmNotify(token, data, type) {
  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      messagingSenderId: '75432506166',
    });
  }

  const message = {
    notification: {
      title: 'Patient Requested',
      body: data,
    },
    data: {
      type: type,
    },
    token: token,
  };

  admin
    .messaging()
    .send(message)
    .then((response) => {
      console.log('Notification sent successfully:', response);
    })
    .catch((error) => {
      console.error('Error sending notification:', error.stack);
    });
}

module.exports = FcmNotify; // Export the function

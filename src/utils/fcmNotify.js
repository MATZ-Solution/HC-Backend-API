const admin = require('firebase-admin');
const serviceAccount = require('./healthcare-f8e9b-firebase-adminsdk-3rc82-dbc1fa92bb.json');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    messagingSenderId: '75432506166',
  });
}

//create a function to send notification
function FcmNotify(token, data, type) {
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
      console.log('notification sent successfully:', response);
    })
    .catch((error) => {
      console.error('Error sending   notification:', error.stack);
    });
}

module.exports = FcmNotify; // Export the function

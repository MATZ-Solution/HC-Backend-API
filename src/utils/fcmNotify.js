const admin = require('firebase-admin'); // Make sure to import the Firebase Admin SDK
const serviceAccount = require('path/to/serviceAccountKey.json');

function FcmNotify(token, data) {
  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      messagingSenderId: '314005293340',
    });
  }

  const message = {
    notification: {
      title: 'Medication Reminder',
      body: data, // Use the data parameter as the notification body
    },
    token: token,
    data: {
      // Include any custom data as needed
      orderId: '353463',
      orderDate: '54236456',
    },
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

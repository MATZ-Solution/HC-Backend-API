var admin = require('firebase-admin');
const { initializeApp, applicationDefault } = require('firebase-admin/app');
const { getMessaging } = require('firebase-admin/messaging');
// var serviceAccount = require('path/to/serviceAccountKey.json');

process.env.GOOGLE_APPLICATION_CREDIENTIALS;

admin.initializeApp({
    credential: applicationDefault(),
    projectId:'healthcare-f8e9b'
});

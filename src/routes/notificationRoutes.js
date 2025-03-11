const express = require('express');
const { verifyToken } = require('../middleware/verifytokens');
const { sendNotificationController, saveNotificationController } = require('../controller/notificationController');
const router = express.Router();


router.post('/sendNotification', sendNotificationController);

router.post('/saveToken', saveNotificationController);




module.exports = router;

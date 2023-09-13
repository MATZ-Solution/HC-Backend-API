const express = require('express');
const notiClt = require('../controller/notiController');
const { verifyToken } = require('../middleware/verifytokens');
const router = express.Router();

router.route('/').get(verifyToken, notiClt.getNotificationHistory);

module.exports = router;

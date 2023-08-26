const express = require('express');
const privacyclt = require('../controller/privacy_Controller');
const { verifyToken } = require("../middleware/verifytokens");
const router = express.Router();




router.route('/').post(verifyToken,  privacyclt.createPrivacyAndPolicy);
router.route('/').get(verifyToken , privacyclt.getPrivacyAndPolicy);
router.route('/:id').put(verifyToken , privacyclt.updatePrivacyAndPolicy);

module.exports = router;
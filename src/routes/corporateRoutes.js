const express = require('express');
const {emailController} = require('../controller/corporateController');
const { verifyTokenAndCorporate,verifyToken } = require("../middleware/verifytokens");
const router = express.Router();



//sending email and updating increment counter
router.route('/sendEmail').post( emailController);


module.exports = router;
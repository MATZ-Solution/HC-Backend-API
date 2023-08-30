const express = require('express');
const { emailController,updateCorporate } = require('../controller/corporateController');
const { verifyTokenAndCorporateAndSuperAdmin} = require("../middleware/verifytokens");
const router = express.Router();



//sending email and updating increment counter
router.route('/sendEmail').post(emailController);
router.put('/updateCorporate',verifyTokenAndCorporateAndSuperAdmin,updateCorporate);

module.exports = router;
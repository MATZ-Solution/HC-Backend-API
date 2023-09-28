const express = require('express');
const noOfCallsMade = require('../controller/noOfCallsMade');
const { verifyTokenAndCorporateAndSuperAdmin } = require("../middleware/verifytokens");
const router = express.Router();




router.route('/getNoOfCallsMade').get(verifyTokenAndCorporateAndSuperAdmin,  noOfCallsMade.getCallsMade);

module.exports = router;
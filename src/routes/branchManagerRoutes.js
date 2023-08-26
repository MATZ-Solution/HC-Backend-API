const express = require('express');
const branchManagerClt = require('../controller/branchManager_Controller');
const { verifyTokenAndCorporate } = require("../middleware/verifytokens");
const router = express.Router();



router.route('/').post(verifyTokenAndCorporate,  branchManagerClt.createBranchManager);


module.exports = router;
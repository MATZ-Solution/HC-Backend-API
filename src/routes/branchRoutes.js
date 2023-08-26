const express = require('express');
const branchClt = require('../controller/branchController');
const { verifyTokenAndCorporate,verifyToken } = require("../middleware/verifytokens");
const router = express.Router();



router.route('/').post(verifyTokenAndCorporate,  branchClt.createBranch);
router.route('/').get(verifyToken,  branchClt.getAllBranches);


module.exports = router;
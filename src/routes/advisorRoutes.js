const express = require('express');
const advisorClt = require('../controller/advisorController');
const { verifyTokenAndAdmin,verifyToken } = require("../middleware/verifytokens");
const router = express.Router();



router.route('/').post(verifyTokenAndAdmin,  advisorClt.createAdvisor);
router.route('/').get(verifyToken,  advisorClt.getAdvisors);
router.route('/getAdvisor').get(advisorClt.getAdvisors);


module.exports = router;
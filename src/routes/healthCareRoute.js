const express = require('express');
const healthCare = require('../controller/HealthCareController');
const router = express.Router();



router.route('/').post(healthCare.addData);


module.exports = router;
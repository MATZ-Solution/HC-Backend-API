const express = require('express');
const meetClt = require('../controller/meet_Sche_Clt');
const { verifyToken } = require("../middleware/verifytokens");
const router = express.Router();




router.route('/').post(verifyToken,  meetClt.bookSchedule);
router.route('/').get(verifyToken , meetClt.getbookSchedule);

module.exports = router;
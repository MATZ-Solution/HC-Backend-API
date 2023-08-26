const express = require('express');
const {createDocAppointment,getAppointment,dltAppointmentByUser,checkAppointment} = require('../controller/appointment_Controller');
const { verifyToken } = require("../middleware/verifytokens");
const router = express.Router();



router.route('/').post(verifyToken,  createDocAppointment);
router.route('/').get(verifyToken,  getAppointment);
router.route('/:appointmentId').delete(verifyToken,  dltAppointmentByUser);
router.route('/checkAppointment').post(verifyToken,  checkAppointment);


module.exports = router;    
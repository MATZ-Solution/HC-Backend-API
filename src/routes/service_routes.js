const express = require("express");
const serviceClt = require("../controller/servicesController");
const { verifyTokenAndCareGivers,verifyToken} = require("../middleware/verifytokens");
const router = express.Router();

router.route("/").post(verifyTokenAndCareGivers, serviceClt.createService);
router.route("/").get(verifyToken, serviceClt.getServices);
router.route("/getAppointmentSlots/:otherCareId/:startDate/:endDate").get(verifyToken, serviceClt.getAppointmentSlots);


module.exports = router;

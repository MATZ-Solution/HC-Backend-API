const express = require("express");
const { createVital, updateVital, getVitalsByUserId } = require("../controller/vitalController");
const {verifyToken} = require("../middleware/verifytokens");
const router = express.Router();

router.route("/").post(verifyToken, createVital);
// router.route("/").get(verifyToken, serviceClt.getServices);


module.exports = router;

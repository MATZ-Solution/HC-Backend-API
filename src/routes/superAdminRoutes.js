const express = require("express");
const superAdminClt = require("../controller/superAdminController");
const { verifyTokenAndAdmin } = require("../middleware/verifytokens");
const router = express.Router();

router.route("/getAllInvoices").get(verifyTokenAndAdmin, superAdminClt.getInvoices);


module.exports = router;

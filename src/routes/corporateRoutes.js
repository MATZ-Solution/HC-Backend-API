const express = require('express');
const { emailController,updateCorporate,addComplainId,getIndividualInvoice } = require('../controller/corporateController');
const { verifyTokenAndCorporateAndSuperAdmin} = require("../middleware/verifytokens");
const router = express.Router();



//sending email and updating increment counter
router.route('/sendEmail').post(emailController);
router.put('/updateCorporate', verifyTokenAndCorporateAndSuperAdmin, updateCorporate);
router.post('/addComplainId', addComplainId)
router.get('/getIndividualInvoice',verifyTokenAndCorporateAndSuperAdmin, getIndividualInvoice)



module.exports = router;
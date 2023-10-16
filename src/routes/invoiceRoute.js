const express = require('express');
const { getInvoice } = require('../controller/invoiceController');
const router = express.Router();
const {
    verifyToken,
    verifyTokenAndAdmin,
    verifyTokenAndCorporate,
  } = require('../middleware/verifytokens');

router.route('/getinvoice').get( getInvoice);

module.exports = router;
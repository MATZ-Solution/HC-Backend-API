const express = require('express');
const { getInvoice } = require('../controller/invoiceController');
const router = express.Router();
const { verifyToken } = require('../middleware/verifytokens');

router.route('/getinvoice', verifyToken).get(getInvoice);

module.exports = router;

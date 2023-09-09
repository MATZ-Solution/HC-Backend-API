const express = require('express');
const { getInvoice } = require('../controller/invoiceController');
const router = express.Router();

router.route('/getinvoice').get(getInvoice);

module.exports = router;
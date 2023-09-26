const express = require('express');
const {
  emailController,
  updateCorporate,
  addComplainId,
  getIndividualInvoice,
  payFacilityInvoice,
  getIndividualInvoiceCount,
  getRecordsOnPayStatus,
  payPartiallyInvoice
} = require('../controller/corporateController');
const {
  verifyTokenAndCorporateAndSuperAdmin,
  verifyTokenAndCorporate,
} = require('../middleware/verifytokens');
const router = express.Router();

//sending email and updating increment counter
router.route('/sendEmail').post(emailController);
router.put(
  '/updateCorporate',
  verifyTokenAndCorporateAndSuperAdmin,
  updateCorporate
);
router.post('/addComplainId', addComplainId);
router.get(
  '/getIndividualInvoice',
  verifyTokenAndCorporateAndSuperAdmin,
  getIndividualInvoice
);
router.put(
  '/payFacilityInvoice/:invoiceId',
  verifyTokenAndCorporate,
  payFacilityInvoice
);
router.get(
  '/getIndividualInvoiceCount',
  verifyTokenAndCorporate,
  getIndividualInvoiceCount
);

router.get(
  '/getRecordsOnPayStatus/:payStatus',
  verifyTokenAndCorporate,
  getRecordsOnPayStatus
);

router.put(
  '/payPartiallyInvoice/:invoiceId',
  verifyTokenAndCorporate,
  payPartiallyInvoice
);


module.exports = router;


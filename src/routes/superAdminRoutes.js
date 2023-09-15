const express = require('express');
const superAdminClt = require('../controller/superAdminController');
const { verifyTokenAndAdmin } = require('../middleware/verifytokens');
const router = express.Router();

router
  .route('/getAllInvoices')
  .get(verifyTokenAndAdmin, superAdminClt.getInvoices);
router.route('/addReviews').post(superAdminClt.addReview);
router.route('/getReviews').get(verifyTokenAndAdmin, superAdminClt.getReviews);
router
  .route('/approvedReviews')
  .put(verifyTokenAndAdmin, superAdminClt.approvedReviews);
router
  .route('/rejectReviews')
  .put(verifyTokenAndAdmin, superAdminClt.rejectReviews);
router
  .route('/getInvoiceCount')
  .get(verifyTokenAndAdmin, superAdminClt.getInvoiceCount);

router
  .route('/getRecordsOnPayStatus/:payStatus')
  .get(verifyTokenAndAdmin, superAdminClt.getRecordsOnPayStatus);

module.exports = router;

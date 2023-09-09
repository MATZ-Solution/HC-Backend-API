const express = require('express');
const superAdminClt = require('../controller/superAdminController');
const { verifyTokenAndAdmin } = require('../middleware/verifytokens');
const router = express.Router();

router
  .route('/getAllInvoices')
  .get(verifyTokenAndAdmin, superAdminClt.getInvoices);
router.route('/addReviews').post(superAdminClt.addReview);
router
  .route('/rejectReviews')
  .put(verifyTokenAndAdmin, superAdminClt.rejectReviews);

module.exports = router;

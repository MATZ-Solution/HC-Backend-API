const express = require("express");
const webReviewsController = require("../controller/webReview_Controller");
const router = express.Router();

router.post('/addcomment',webReviewsController.addWebReviews)
router.get('/getcomment',webReviewsController.getWebReviews)
router.put('/approvecomment/:id',webReviewsController.approvedReview)
router.put('/approvecommentdisplay/:id',webReviewsController.approvedDisplayComment)

module.exports = router;

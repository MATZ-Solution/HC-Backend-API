const express = require("express");
const webReviewsController = require("../controller/webReview_Controller");
const router = express.Router();

router.post('/addcomment',webReviewsController.addWebReviews)
router.get('/getcomment',webReviewsController.getWebReviews)

module.exports = router;

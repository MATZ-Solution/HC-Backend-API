const webReviewModel = require("../Model/webReviewModel");

const webReviewsController = {
  addWebReviews: async (req, res, next) => {
    try {
      const { name,email,comment } = req.body;

      await webReviewModel.create({ name,email,comment });

      res.status(201).json({
        success: true,
        message: "your comment sent successfully",
        
      });
    } catch (error) {
      next(error);
    }
  },
  getWebReviews:async(req,res,next)=>{
    try{
    const displayReviews = await webReviewModel.find({ $and: [{ isToDisplay: true }, { isCommentApproved: true }] });

        
       res.status(200).json(displayReviews)
    }
    catch (error) {
        next(error);
      }
  },
    approvedDisplayComment: async (req, res, next) => {
    try {
        const reviewId = req.params.id;
        const { isToDisplay } = req.body;

        // Update the review based on the provided ID
        await webReviewModel.findByIdAndUpdate(reviewId, {
            isToDisplay,
        }, { new: true });

        // Fetch the updated review
        const updatedReview = await webReviewModel.findById(reviewId);

        // Send the updated review as a response
        res.status(201).json({
            success: true,
            message: "update Display Comment successfully",
            
          });
    } catch (error) {
        // If an error occurs, pass it to the next middleware
        next(error);
    }
},
approvedReview: async (req, res, next) => {
    try {
        const reviewId = req.params.id;
        const { isCommentApproved } = req.body;

        await webReviewModel.findByIdAndUpdate(reviewId, {
            isCommentApproved
        }, { new: true });

        const updatedReview = await webReviewModel.findById(reviewId);

        res.status(201).json({
            success: true,
            message: "update Approve Reviews successfully",
            
          });
    } catch (error) {
        next(error);
    }
}
}


module.exports = webReviewsController

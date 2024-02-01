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
    const displayReviews = await webReviewModel.find({ $and: [{ isToDisplay: true }, { isCommentApproved: "Accepted" }] });

        
       res.status(200).json(displayReviews)
    }
    catch (error) {
        next(error);
      }
  },
 
}


module.exports = webReviewsController

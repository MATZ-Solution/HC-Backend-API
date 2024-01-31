const mongoose = require('mongoose');

// Define a schema for your model
const webReviewSchema = new mongoose.Schema(
  {
  
    name: {
      type: String,
    },
    email: {
      type: String,
    },
    comment: {
      type: String,
    },
  
    isCommentApproved: {
      type: Boolean,
      default: false,
    },
    isToDisplay: {
        type: Boolean,
        default: false,
      },
  },
  { timestamps: true }
);

// Create a model based on the schema
const webReviewModel = mongoose.model('webReviewsModel', webReviewSchema);

module.exports = webReviewModel;

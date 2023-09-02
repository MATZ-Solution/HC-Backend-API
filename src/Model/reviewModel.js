const mongoose = require('mongoose');

// Define a schema for your model
const reviewSchema = new mongoose.Schema({
    mongoDbID: {
        type: String,
    },
    category: {
        type: String,
    },
    name: {
        type: String,
    },
    email: {
        type: String,
    },
    reviews: {
        type: String,
    },
    startRating: {
        type: Number,
        default: 3,
    },
});

// Create a model based on the schema
const reviewsModel = mongoose.model('reviewsModel', reviewSchema);

module.exports = reviewsModel;

const mongoose = require("mongoose");

const corporateSchema = new mongoose.Schema(
    {
        category: {
            type: String
        },
        objectId: {
            type: Number
        },
        patId: {
            type: String,
            ref: "Corporate",
        },
    },
    { timestamps: true }
);

const Corporate = mongoose.model("Corporate", corporateSchema);

module.exports = Corporate;

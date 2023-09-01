const mongoose = require("mongoose");

const favourateSchema = new mongoose.Schema(
    {
        category: {
            type: String
        },
        scrapeObjectId: {
            type: Number
        },
        patId: {
            type: String,
            ref: "User",
        },
    },
    { timestamps: true }
);

const Favourate = mongoose.model("favourate", favourateSchema);

module.exports = Favourate;

const mongoose = require("mongoose");

const favourateSchema = new mongoose.Schema(
    {
        category: {
            type: String
        },
        scrapeObjectId: {
            type: String
        },
        patId: {
            type: String,
            ref: "User",
        },
        corporateId: {
            type: String,
            ref: "Corporate",
        },
        superAdminId: {
            type: String,
            ref: "superAdmin",
        },
    },
    { timestamps: true }
);

const Favourate = mongoose.model("favourate", favourateSchema);

module.exports = Favourate;

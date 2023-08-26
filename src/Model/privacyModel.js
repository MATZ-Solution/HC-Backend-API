const mongoose = require("mongoose");

const privacySchema = mongoose.Schema(
    {
        desc: {
            type: String
        },
        lastUpdated: {
            type: String
        }

    }, { timestamps: true });

const privacymodel = mongoose.model("privacy", privacySchema);

module.exports = privacymodel;
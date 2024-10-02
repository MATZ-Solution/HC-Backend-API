const mongoose = require("mongoose");
const facilityRequestSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    email: {
        type: String,
    },
    facility_name: {
        type: String,
    },
    category: {
        type: String,
    },
    city: {
        type: String,
    },
    state: {
        type: String,
    },
    zip: {
        type: Number,
    },
    address: {
        type: String,
    },
    status: {
        type: String,
        default: 'pending'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
    }
});
const FacilityRequest = mongoose.model("FacilityRequest", facilityRequestSchema);
module.exports= FacilityRequest;
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// name: name,
//         email: email,
//         update: update,
//         category: category,
//         mongoDbID: mongoDbID
const facilityRequestSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    email: {
        type: String,
    },
    update: {
        type: String,
    },
    category: {
        type: String,
    },
    mongoDbID: {
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
const UpdateFacilityRequest = mongoose.model("UpdateFacilityRequest", facilityRequestSchema);
module.exports= UpdateFacilityRequest;
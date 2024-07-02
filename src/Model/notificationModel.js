const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const notificationSchema = new Schema({
    email: {
        type: String,
    },
    message: {
        type: String,
    },
    read: {
        type: Boolean,
        default: false
    },
    mongoDbID: {
        type: String,
        require:false
    },
    platform: {
        type: String,
        require:false,
        default:"app",
    },  
    // facilityName:{
    //     type:String,
    //     require:false
    // },
    
    createdAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

const notificationModel = mongoose.model('notificationModel', notificationSchema);
module.exports = notificationModel;
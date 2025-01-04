const mongoose = require('mongoose');


const GetInTouchSchema = new mongoose.Schema(
  {
    name: {
        type: String,
    },
    email: {
      type: String,
    },
    text:{
        type: String,
    }
  },
    
  { timestamps: true }
);

module.exports = mongoose.model('updateRequest', GetInTouchSchema);

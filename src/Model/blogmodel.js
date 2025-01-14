const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  shortText: {
    type: String,
  },
  category: {
    type: String,
  },
  image: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  lastEdited: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ['Pending', 'Accepted'],
    default: 'Pending',
  },
});

module.exports = mongoose.model('Blog', blogSchema);

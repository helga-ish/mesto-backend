const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  link: {
    type: String,
  },

  owner: {
    type: mongoose.ObjectId,
    required: true,
  },

  likes: {
    type: [mongoose.ObjectId],
    default: [],
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('card', cardSchema);

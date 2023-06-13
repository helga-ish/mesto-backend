const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
    validate: {
      validator(v) {
        return v > 2 && v <= 30;
      },
      message: 'Поле Название должно содержать от 2 до 30 символов!',
    }
  },

  link: {
    type: String,
    required: true,
    validate: {
      validator(v) {
        v => validator.isURL(v, { protocols: ['http','https','ftp'], require_tld: true, require_protocol: true });
      },
        message: 'Аватар должен быть ссылкой (URL)!',
      }
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
  }
});

module.exports = mongoose.model('card', cardSchema);
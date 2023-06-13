const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
    validate: {
      validator(v) {
        return v > 2 && v <= 30;
      },
      message: 'Поле Имя должно содержать от 2 до 30 символов!',
    }
  },
  about: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
    validate: {
      validator(v) {
        return v > 2 && v <= 30;
      },
      message: 'Поле О себе должно содержать от 2 до 30 символов!',
    }
  },
  avatar: {
    type: String,
    required: true,
    validate: {
      validator(v) {
        v => validator.isURL(v, { protocols: ['http','https','ftp'], require_tld: true, require_protocol: true });
      },
        message: 'Аватар должен быть ссылкой (URL)!',
      }
  }
});

module.exports = mongoose.model('user', userSchema);
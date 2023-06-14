const mongoose = require('mongoose');
// const { validator } = require('express');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  about: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  avatar: {
    type: String,
    required: true,
    validate: {
      validator(v) {
        validator.isURL(v, { protocols: ['http', 'https', 'ftp'], require_tld: true, require_protocol: true });
      },
      message: 'Аватар должен быть ссылкой (URL)!',
    },
  },
});

module.exports = mongoose.model('user', userSchema);

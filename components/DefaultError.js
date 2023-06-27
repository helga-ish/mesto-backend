const { DEFAULT_ERROR } = require('../constants/constants');

class DefaultError extends Error {
  constructor(message) {
    super(message);
    this.name = 'DefaultError';
    this.statusCode = DEFAULT_ERROR;
  }
}

module.exports = DefaultError;

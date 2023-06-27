const { NOT_FOUND_ERROR } = require('../constants/constants');

class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = 'NotFoundError';
    this.statusCode = NOT_FOUND_ERROR;
  }
}

module.exports = NotFoundError;

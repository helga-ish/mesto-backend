const { BAD_REQUEST_ERROR } = require('../constants/constants');

class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ValidationError';
    this.statusCode = BAD_REQUEST_ERROR;
  }
}
module.exports = ValidationError;

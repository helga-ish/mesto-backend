const { FORBIDDEN_ERROR } = require('../constants/constants');

class ForbiddenError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ForbiddenError';
    this.statusCode = FORBIDDEN_ERROR;
  }
}

module.exports = ForbiddenError;

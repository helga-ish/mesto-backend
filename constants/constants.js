const http2 = require('http2');

const BAD_REQUEST_ERROR = http2.constants.HTTP_STATUS_BAD_REQUEST; // 400
const NOT_FOUND_ERROR = http2.constants.HTTP_STATUS_NOT_FOUND; // 404
const DEFAULT_ERROR = http2.constants.HTTP_STATUS_INTERNAL_SERVER_ERROR;

module.exports = {
  BAD_REQUEST_ERROR,
  NOT_FOUND_ERROR,
  DEFAULT_ERROR,
};

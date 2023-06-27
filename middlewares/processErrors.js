// const {
//   BAD_REQUEST_ERROR,
//   NOT_FOUND_ERROR,
//   DEFAULT_ERROR,
//   UNAUTHORIZED_ERROR,
// } = require('../constants/constants');

const processErrors = (err, req, res, next) => {
  res.status(err.statusCode).send({ message: err.message });
  // if (err.statusCode === BAD_REQUEST_ERROR) {
  //   res.send({ message: '' });
  // }

  if (err.statusCode == null) {
    const { statusCode = 500, message } = err;

    res
      .status(statusCode)
      .send({
        message: statusCode === 500
          ? 'На сервере произошла ошибка'
          : message,
      });
  }
};

module.exports = processErrors;

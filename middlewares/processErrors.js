const { CONFLICT_ERROR } = require('../constants/constants');
const ValidationError = require('../components/ValidationError');
const NotFoundError = require('../components/NotFoundError');
const UnauthorizedError = require('../components/UnauthorizedError');
const ForbiddenError = require('../components/ForbiddenError');

const processErrors = (err, req, res, next) => {
  if (err.name === 'ValidationError') {
    const error = new ValidationError('Переданы некорректные данные.');
    res
      .status(error.statusCode)
      .send({ message: error.message });
  } else if (err.name === 'NotFoundError') {
    const error = new NotFoundError('Страница не найдена.');
    res
      .status(error.statusCode)
      .send({ message: error.message });
  } else if (err.name === 'UnauthorizedError') {
    const error = new UnauthorizedError('Необходима авторизация.');
    res
      .status(error.statusCode)
      .send({ message: error.message });
  } else if (err.name === 'ForbiddenError') {
    const error = new ForbiddenError('Нет доступа.');
    res
      .status(error.statusCode)
      .send({ message: error.message });
  } else if (err.code === 11000) {
    res
      .status(CONFLICT_ERROR)
      .send({ message: 'Пользователь с таким email уже существует.' });
  } else if (err.statusCode == null) {
    const { statusCode = 500, message } = err;

    res
      .status(statusCode)
      .send({
        message: statusCode === 500
          ? 'На сервере произошла ошибка.'
          : message,
      });
  }
  return next;
};

module.exports = processErrors;

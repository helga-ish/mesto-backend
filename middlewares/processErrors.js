const {
  BAD_REQUEST_ERROR,
  NOT_FOUND_ERROR,
  UNAUTHORIZED_ERROR,
  FORBIDDEN_ERROR,
  CONFLICT_ERROR,
} = require('../constants/constants');
const ValidationError = require('../components/ValidationError');
const NotFoundError = require('../components/NotFoundError');
const UnauthorizedError = require('../components/UnauthorizedError');

const processErrors = (err, req, res, next) => {
  if (ValidationError) {
    res
      .status(BAD_REQUEST_ERROR)
      .send({ message: 'Переданы некорректные данные.' });
  } else if (NotFoundError) {
    res
      .status(NOT_FOUND_ERROR)
      .send({ message: 'Страница не найдена.' });
  } else if (UnauthorizedError) {
    res
      .status(UNAUTHORIZED_ERROR)
      .send({ message: 'Необходима авторизация.' });
  } else if (err.statusCode === FORBIDDEN_ERROR) {
    res
      .status(FORBIDDEN_ERROR)
      .send({ message: 'Нет доступа.' });
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
};

module.exports = processErrors;

// Авторизация с несуществующими email и password в БД - код ответа 401

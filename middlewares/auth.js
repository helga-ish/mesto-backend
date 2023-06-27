const jwt = require('jsonwebtoken');
const { NOT_FOUND_ERROR } = require('../constants/constants');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res
      .status(NOT_FOUND_ERROR)
      .send({ message: 'Необходима авторизация' });
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, 'some-secret-key');
  } catch (err) {
    return res
      .status(NOT_FOUND_ERROR)
      .send({ message: 'Необходима авторизация' });
  }

  req.user = payload;

  next();
};

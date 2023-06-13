const User = require('../models/user');
const http2 = require('http2');

const BAD_REQUEST_ERROR = http2.constants.HTTP_STATUS_BAD_REQUEST; // 400
const NOT_FOUND_ERROR = http2.constants.HTTP_STATUS_NOT_FOUND; // 404
const DEFAULT_ERROR = http2.constants.HTTP_STATUS_INTERNAL_SERVER_ERROR;

class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = "ValidationError";
    this.statusCode = BAD_REQUEST_ERROR;
  }
}
class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = "NotFoundError";
    this.statusCode = NOT_FOUND_ERROR;
  }
}
class DefaultError extends Error {
  constructor(message) {
    super(message);
    this.name = "DefaultError";
    this.statusCode = DEFAULT_ERROR;
  }
}

const getUsers = (req, res) => {
  User.find({})
  .then(users => res.send({ data: users }))
  .catch(err => res.status(DEFAULT_ERROR).send({ message: 'Запрашиваемый пользователь не найден' }));
}

const getUserById = (req, res) => {

  User.findById(req.params.userId)
  .then(user => res.status(200).send({ data: user }))
  .catch((err) => {
    if (err.name === 'NotFoundError') {
      return res
        .status(NOT_FOUND_ERROR)
        .send({ message: 'Пользователь по указанному _id не найден.' })
    } else if (err.name === 'DefaultError') {
      return res
        .status(DEFAULT_ERROR)
        .send({ message: 'На сервере произошла ошибка' })
    }
})
}

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
  .then(user => res.send({ data: user }))
  .catch((err) => {
    if (err.name === 'ValidationError') {
      return res
        .status(BAD_REQUEST_ERROR)
        .send({ message: 'Переданы некорректные данные при создании пользователя.' })
    } else if (err.name === 'DefaultError') {
      return res
        .status(DEFAULT_ERROR)
        .send({ message: 'На сервере произошла ошибка' })
    }
})
}

const updateProfile = (req, res) => {
  const { name, about } = req.body;

  const currentUser = req.user._id;

  User.findByIdAndUpdate(
    currentUser,
    { name, about },
    { new: true,
      runValidators: true })
  .then(user => res.status(200).send({ data: user }))
  .catch((err) => {
    if (err.name === 'ValidationError') {
      return res
        .status(BAD_REQUEST_ERROR)
        .send({ message: 'Переданы некорректные данные при обновлении профиля.' })
    } else if (err.name === 'NotFoundError') {
      return res
        .status(NOT_FOUND_ERROR)
        .send({ message: 'Пользователь по указанному _id не найден.' })
    } else if (err.name === 'DefaultError') {
      return res
        .status(DEFAULT_ERROR)
        .send({ message: 'На сервере произошла ошибка' })
    }
})
}

const updateAvatar = (req, res) => {
  const { avatar } = req.body;

  const currentUser = req.user._id;

  User.findByIdAndUpdate(
    currentUser,
    { avatar },
    { new: true,
    runValidators: true })
  .then(user => res.status(200).send({ data: user }))
  .catch((err) => {
    if (err.name === 'ValidationError') {
      return res
        .status(BAD_REQUEST_ERROR)
        .send({ message: 'Переданы некорректные данные при обновлении аватара.' })
    } else if (err.name === 'NotFoundError') {
      return res
        .status(NOT_FOUND_ERROR)
        .send({ message: 'Пользователь по указанному _id не найден.' })
    } else if (err.name === 'DefaultError') {
      return res
        .status(DEFAULT_ERROR)
        .send({ message: 'На сервере произошла ошибка' })
    }
})
}

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateProfile,
  updateAvatar
}
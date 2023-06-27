const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const {
  BAD_REQUEST_ERROR,
  NOT_FOUND_ERROR,
  DEFAULT_ERROR,
  UNAUTHORIZED_ERROR,
} = require('../constants/constants');

const login = (req, res) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        'some-secret-key',
        { expiresIn: '7d' },
      );
      res.send({ token });
    })
    .catch((err) => {
      if (err.name === 'UnauthorizedError') {
        res
          .status(UNAUTHORIZED_ERROR)
          .send({ message: 'Пользователя не существует.' });
      } else if (err.name === 'ValidationError') {
        res
          .status(BAD_REQUEST_ERROR)
          .send({ message: 'Переданы некорректные данные при поиске пользователя.' });
      }
      return res
        .status(NOT_FOUND_ERROR)
        .send({ message: 'Пользователь не найден.' });
    });
};

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(() => res.status(DEFAULT_ERROR).send({ message: 'Запрашиваемый пользователь не найден' }));
};

const getUserById = (req, res) => {
  User.findById(req.user._id)
    .orFail()
    .then((user) => res.status(200).send({ data: user }))
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        res
          .status(NOT_FOUND_ERROR)
          .send({ message: 'Пользователь по указанному _id не найден.' });
      } else if (err.name === 'CastError') {
        return res
          .status(BAD_REQUEST_ERROR)
          .send({ message: 'Переданы некорректные данные при поиске пользователя.' });
      }
      return res
        .status(DEFAULT_ERROR)
        .send({ message: 'На сервере произошла ошибка' });
    });
};

const createUser = (req, res) => {
  bcrypt.hash(req.body.password, 10)
    .then((hash) => User.create({
      name: req.body.name,
      about: req.body.about,
      avatar: req.body.avatar,
      email: req.body.email,
      password: hash,
    }))
    .then((user) => res.send({
      _id: user._id,
      email: user.email,
      name: user.name,
      about: user.about,
      avatar: user.avatar,
    }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res
          .status(BAD_REQUEST_ERROR)
          .send({ message: 'Переданы некорректные данные при создании пользователя.' });
      }
      return res
        .status(DEFAULT_ERROR)
        .send({ message: 'На сервере произошла ошибка.' });
    });
};

const updateProfile = (req, res) => {
  const { name, about } = req.body;

  const currentUser = req.user._id;

  User.findByIdAndUpdate(
    currentUser,
    { name, about },
    {
      new: true,
      runValidators: true,
    },
  )
    .orFail()
    .then((user) => res.status(200).send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res
          .status(BAD_REQUEST_ERROR)
          .send({ message: 'Переданы некорректные данные при обновлении профиля.' });
      } else if (err.name === 'DocumentNotFoundError') {
        return res
          .status(NOT_FOUND_ERROR)
          .send({ message: 'Пользователь по указанному _id не найден.' });
      }
      return res
        .status(DEFAULT_ERROR)
        .send({ message: 'На сервере произошла ошибка' });
    });
};

const updateAvatar = (req, res) => {
  const { avatar } = req.body;

  const currentUser = req.user._id;

  User.findByIdAndUpdate(
    currentUser,
    { avatar },
    {
      new: true,
      runValidators: true,
    },
  )
    .orFail()
    .then((user) => res.status(200).send({ data: user }))
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        res
          .status(NOT_FOUND_ERROR)
          .send({ message: 'Пользователь по указанному _id не найден.' });
      } else if (err.name === 'ValidationError') {
        return res
          .status(BAD_REQUEST_ERROR)
          .send({ message: 'Переданы некорректные данные при обновлении аватара.' });
      }
      return res
        .status(DEFAULT_ERROR)
        .send({ message: 'На сервере произошла ошибка' });
    });
};

module.exports = {
  login,
  getUsers,
  getUserById,
  createUser,
  updateProfile,
  updateAvatar,
};

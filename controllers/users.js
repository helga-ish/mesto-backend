const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const {
  // BAD_REQUEST_ERROR,
  // DEFAULT_ERROR,
  // CONFLICT_ERROR,
  // UNAUTHORIZED_ERROR,
  // NOT_FOUND_ERROR,
} = require('../constants/constants');
const UnauthorizedError = require('../components/UnauthorizedError');

const login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then(() => {
      User.findOne(
        {
          $or: [{ email: req.body.email }, { password: req.body.password }],
        },
      )
        .then((user) => {
          const token = jwt.sign(
            { _id: user._id },
            'some-secret-key',
            { expiresIn: '7d' },
          );
          res.send({ token });
        })
        .catch(next);
    })
    .catch(() => new UnauthorizedError({ message: 'Такого пользователя не существует.' }));
};

const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(next);
};

const getMe = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => res.status(200).send({ data: user }))
    .catch(next);
};

const getUserById = (req, res, next) => {
  User.findOne({ _id: req.params.userId })
    .orFail()
    .then(() => {
      User.findById(req.params.userId)
        .then((user) => {
          if (user != null) {
            res.status(200).send({ data: user });
          }
          return next();
        })
        .catch(next);
    })
    .catch(next);
  // .catch(() => res.status(NOT_FOUND_ERROR).send({ message: 'Пользователь не найден.' }));
};

const createUser = (req, res, next) => {
  bcrypt.hash(req.body.password, 10)
    .then((hash) => {
      User.create(
        {
          email: req.body.email,
          password: hash,
          name: req.body.name,
          about: req.body.about,
          avatar: req.body.avatar,
        },
      )
        .then((user) => res.send({
          _id: user._id,
          email: user.email,
          name: user.name,
          about: user.about,
          avatar: user.avatar,
        }))
        .catch(next);
        // .catch((err) => {
        //   if (err.code === 11000) {
        //     res
        //       .status(CONFLICT_ERROR)
        //       .send({ message: 'Пользователя с таким email уже существует.' });
        //   } else if (err.name === 'ValidationError') {
        //     return res
        //       .status(BAD_REQUEST_ERROR)
        //       .send({ message: 'Переданы некорректные данные при создании пользователя.' });
        //   }
        //   return res
        //     .status(DEFAULT_ERROR)
        //     .send({ message: 'На сервере произошла ошибка.' });
        // });
    })
    .catch(next);
};

const updateProfile = (req, res, next) => {
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
    .then((user) => res.status(200).send({ data: user }))
    .catch(next);
};

const updateAvatar = (req, res, next) => {
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
    .then((user) => res.status(200).send({ data: user }))
    .catch(next);
};

module.exports = {
  login,
  getUsers,
  getMe,
  getUserById,
  createUser,
  updateProfile,
  updateAvatar,
};

const User = require('../models/user');

const ValidationError = (res) => res.status(400);
const NotFoundError = (res) => res.status(404);
const DefaultError = (res) => res.status(500);

const getUsers = (req, res) => {
  User.find({})
  .then(users => res.send({ data: users }))
  .catch(err => res.status(500).send({ message: 'Запрашиваемый пользователь не найден' }));
}

const getUserById = (req, res) => {

  User.findById(req.user._id)
  .then(user => res.send({ data: user }))
  .catch((err) => {
    if (NotFoundError(res)) {
      return res.send({ message: 'Пользователь по указанному _id не найден.' })
    } else if (DefaultError) {
      return res.send({ message: 'На сервере произошла ошибка' })
    }
})
}

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
  .then(user => res.send({ data: user }))
  .catch((err) => {
    if (ValidationError) {
      return res.send({ message: 'Переданы некорректные данные при создании пользователя.' })
    } else if (DefaultError) {
      return res.send({ message: 'На сервере произошла ошибка' })
    }
})
}

const updateProfile = (req, res) => {
  const { name, about } = req.body;

  const currentUser = req.user._id;

  User.findByIdAndUpdate(currentUser, { name, about }, { new: true })
  .then(user => res.send({ data: user }))
  .catch((err) => {
    if (ValidationError(res)) {
      return res.send({ message: 'Переданы некорректные данные при обновлении профиля.' })
    } else if (NotFoundError(res)) {
      return res.send({ message: 'Пользователь по указанному _id не найден.' })
    } else if (DefaultError(res)) {
      return res.send({ message: 'На сервере произошла ошибка' })
    }
})
}

const updateAvatar = (req, res) => {
  const { avatar } = req.body;

  const currentUser = req.user._id;

  User.findByIdAndUpdate(currentUser, { avatar }, { new: true })
  .then(user => res.send({ data: user }))
  .catch((err) => {
    if (ValidationError(res)) {
      return res.send({ message: 'Переданы некорректные данные при обновлении аватара.' })
    } else if (NotFoundError(res)) {
      return res.send({ message: 'Пользователь по указанному _id не найден.' })
    } else if (DefaultError(res)) {
      return res.send({ message: 'На сервере произошла ошибка' })
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
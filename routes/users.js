const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getUsers,
  getMe,
  getUserById,
  updateProfile,
  updateAvatar,
} = require('../controllers/users');

router.get('/users', getUsers);

router.get('/users/me', celebrate({
  body: Joi.object().keys({
    id: Joi.string().required().length(24).hex(),
  }),
}), getMe);

router.get('/users/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().required().length(24).hex(),
  }),
}), getUserById);

router.patch('/users/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
}), updateProfile);

router.patch('/users/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().pattern(/(^https?:\/\/)?(www\.)?[a-z0-9~_\-.]+\.[a-z]{2,9}(\/|:|\?[!-~]*)?$/i),
  }),
}), updateAvatar);

module.exports = router;

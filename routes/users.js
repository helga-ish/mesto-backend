const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getUsers,
  getUserById,
  updateProfile,
  updateAvatar,
} = require('../controllers/users');

router.get('/users', getUsers);
router.get('/users/:userId', celebrate({
  body: Joi.object().keys({
    id: Joi.string().required().length(24).hex(),
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
    avatar: Joi.string().pattern(/https?:\/\/(www\.)?[a-zA-Z0-9\-._~:/?#[\]@!$&'()*+,;=]/),
  }),
}), updateAvatar);

module.exports = router;

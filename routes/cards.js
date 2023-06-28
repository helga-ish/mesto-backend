const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getCards,
  createCard,
  deleteCard,
  putLike,
  deleteLike,
} = require('../controllers/cards');

router.get('/cards', getCards);

router.post('/cards', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().pattern(/https?:\/\/(www\.)?[a-zA-Z0-9\-._~:/?#[\]@!$&'()*+,;=]/),
  }).unknown(true),
}), createCard);

router.delete('/cards/:cardId', celebrate({
  body: Joi.object().keys({
    id: Joi.string().required().length(24).hex(),
  }).unknown(true),
}), deleteCard);

router.put('/cards/:cardId/likes', celebrate({
  body: Joi.object().keys({
    id: Joi.string().required().length(24).hex(),
  }).unknown(true),
}), putLike);

router.delete('/cards/:cardId/likes', celebrate({
  body: Joi.object().keys({
    id: Joi.string().required().length(24).hex(),
  }).unknown(true),
}), deleteLike);

module.exports = router;

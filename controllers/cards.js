const Card = require('../models/card');
const {
  DEFAULT_ERROR, NOT_FOUND_ERROR, FORBIDDEN_ERROR,
} = require('../constants/constants');

const getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.status(200).send({ data: cards }))
    .catch(() => res.status(DEFAULT_ERROR).send({ message: 'На сервере произошла ошибка' }));
};

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  Card.create({ name, link, owner })
    .then((card) => res.status(200).send({ data: card }))
    .catch(next);
};

const deleteCard = (req, res, next) => {
  Card.findOne({ _id: req.params.cardId })
    .orFail()
    .then(() => {
      Card.findByIdAndRemove(req.params.cardId)
        .then((card) => {
          if (req.owner === req.user._id) {
            res.status(200).send({ data: card });
          }
          return next();
        })
        .catch(() => res.status(FORBIDDEN_ERROR).send({ message: 'Нет доступа.' }));
    })
    .catch(() => res.status(NOT_FOUND_ERROR).send({ message: 'Карточка не найдена.' }));
};

const putLike = (req, res, next) => {
  Card.findOne({ _id: req.params.cardId })
    .orFail()
    .then(() => {
      Card.findByIdAndUpdate(
        req.params.cardId,
        { $addToSet: { likes: req.user._id } },
        { new: true },
      )
        .then((card) => res.status(200).send({ data: card }))
        .catch(next);
    })
    .catch(() => res.status(NOT_FOUND_ERROR).send({ message: 'Карточка не найдена.' }));
};

const deleteLike = (req, res, next) => {
  Card.findOne({ _id: req.params.cardId })
    .orFail()
    .then(() => {
      Card.findByIdAndUpdate(
        req.params.cardId,
        { $pull: { likes: req.user._id } },
        { new: true },
      )
        .then((card) => res.status(200).send({ data: card }))
        .catch(next);
    })
    .catch(() => res.status(NOT_FOUND_ERROR).send({ message: 'Карточка не найдена.' }));
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  putLike,
  deleteLike,
};

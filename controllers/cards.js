const Card = require('../models/card');
const {
  BAD_REQUEST_ERROR,
  NOT_FOUND_ERROR,
  DEFAULT_ERROR,
  FORBIDDEN_ERROR,
} = require('../constants/constants');

const getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.status(200).send({ data: cards }))
    .catch(() => res.status(DEFAULT_ERROR).send({ message: 'На сервере произошла ошибка' }));
};

const createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  Card.create({ name, link, owner })
    .then((card) => res.status(200).send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST_ERROR)
          .send({ message: 'Переданы некорректные данные при создании карточки.' });
      } else {
        res.status(DEFAULT_ERROR)
          .send({ message: 'На сервере произошла ошибка' });
      }
    });
};

const deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId, { select: req.owner === req.user._id })
    .orFail()
    .then((card) => res.status(200).send({ data: card }))
    .catch((err) => {
      if (err.code === 403) {
        res
          .status(FORBIDDEN_ERROR)
          .send({ message: 'У Вас нет доступа.' });
      } else if (err.name === 'DocumentNotFoundError') {
        res
          .status(NOT_FOUND_ERROR)
          .send({ message: 'Карточка с указанным _id не найдена.' });
      } else if (err.name === 'CastError') {
        return res
          .status(BAD_REQUEST_ERROR)
          .send({ message: 'Переданы некорректные данные при поиске карточки.' });
      }
      return res
        .status(DEFAULT_ERROR)
        .send({ message: 'На сервере произошла ошибка' });
    });
};

const putLike = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail()
    .then((card) => res.status(200).send({ data: card }))
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        res
          .status(NOT_FOUND_ERROR)
          .send({ message: 'Передан несуществующий _id карточки.' });
      } else if (err.name === 'CastError') {
        res.status(BAD_REQUEST_ERROR)
          .send({ message: 'Переданы некорректные данные для постановки лайка. ' });
      }
      return res
        .status(DEFAULT_ERROR)
        .send({ message: 'На сервере произошла ошибка' });
    });
};

const deleteLike = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail()
    .then((card) => res.status(200).send({ data: card }))
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        res
          .status(NOT_FOUND_ERROR)
          .send({ message: 'Передан несуществующий _id карточки.' });
      } else if (err.name === 'CastError') {
        res.status(BAD_REQUEST_ERROR)
          .send({ message: 'Переданы некорректные данные для снятия лайка. ' });
      }
      return res
        .status(DEFAULT_ERROR)
        .send({ message: 'На сервере произошла ошибка' });
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  putLike,
  deleteLike,
};

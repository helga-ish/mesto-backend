const Card = require('../models/card');
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



const getCards = (req, res) => {
  Card.find({})
  .then(cards => res.status(200).send({ data: cards }))
  .catch((err) => res.status(DEFAULT_ERROR).send({ message: 'На сервере произошла ошибка' }))
};

const createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  Card.create({ name, link, owner })
    .then(card => res.status(200).send({ data: card }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        res.status(BAD_REQUEST_ERROR)
          .send({ message: 'Переданы некорректные данные при создании карточки.' })
      } else {
        res.status(DEFAULT_ERROR)
          .send({ message: 'На сервере произошла ошибка' })
      }
})
};

const deleteCard = (req, res) => {

  Card.findByIdAndRemove(req.params.cardId)
  .orFail(() => res.status(NOT_FOUND_ERROR).send({ message: 'Карточка с указанным _id не найдена.'}))
  .then(card => res.status(200).send({ data: card }))
  .catch(err => res.status(BAD_REQUEST_ERROR).send({ message: 'Переданы некорректные данные при поиске карточки.' }))
}


const putLike = (req, res) => {

  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
  .orFail(() => res.status(NOT_FOUND_ERROR).send({ message: 'Передан несуществующий _id карточки.'}))
  .then(card => res.status(200).send({ data: card}))
  .catch((err) => {
    if (err.name === 'CastError') {
      res.status(BAD_REQUEST_ERROR)
        .send({ message: 'Переданы некорректные данные для постановки лайка. ' })
    } else if (DEFAULT_ERROR) {
      return res.send({ message: 'На сервере произошла ошибка' })
    }
})
}

const deleteLike = (req, res) => {

  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
  .orFail(() => res.status(NOT_FOUND_ERROR).send({ message: 'Передан несуществующий _id карточки.'}))
  .then(card => res.status(200).send({ data: card}))
  .catch((err) => {
    if (err.name === 'CastError') {
      res.status(BAD_REQUEST_ERROR)
        .send({ message: 'Переданы некорректные данные для снятия лайка. ' })
    } else if (DEFAULT_ERROR) {
      return res.send({ message: 'На сервере произошла ошибка' })
    }
})
}

module.exports = {
  getCards,
  createCard,
  deleteCard,
  putLike,
  deleteLike
}
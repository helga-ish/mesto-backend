const Card = require('../models/card');

const ValidationError = (res) => res.status(400);
const NotFoundError = (res) => res.status(404);
const DefaultError = (res) => res.status(500);


const getCards = (req, res) => {
  Card.find({})
  .then(cards => res.send({ data: cards }))
  .catch((err) => res.status(500).send({ message: 'На сервере произошла ошибка' }))
};

const createCard = (req, res) => {
  const { name, link } = req.body;

  const owner = req.user._id;

  Card.create({ name, link, owner })
  .then(card => res.send({ data: card }))
  .catch((err) => {
    if (ValidationError) {
      return res.send({ message: 'Переданы некорректные данные при создании карточки.' })
    } else if (DefaultError) {
      return res.send({ message: 'На сервере произошла ошибка' })
    }
})
};

const deleteCard = (req, res) => {

  Card.findByIdAndRemove(req.params.cardId)
  .then(card => res.send({ data: card }))
  .catch(err => res.status(404).send({ message: 'Карточка с указанным _id не найдена.' }))
}

const putLike = (req, res) => {

  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
  .then(card => res.send({ data: card}))
  .catch((err) => {
    if (ValidationError(res)) {
      return res.send({ message: 'Переданы некорректные данные для постановки лайка. ' })
    } else if (NotFoundError(res)) {
      return res.send({ message: 'Передан несуществующий _id карточки.' })
    } else if (DefaultError(res)) {
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
  .then(card => res.send({ data: card}))
  .catch((err) => {
    if (ValidationError(res)) {
      return res.send({ message: 'Переданы некорректные данные для снятия лайка. ' })
    } else if (NotFoundError(res)) {
      return res.send({ message: 'Передан несуществующий _id карточки.' })
    } else if (DefaultError(res)) {
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
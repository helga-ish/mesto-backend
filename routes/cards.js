const router = require('express').Router();
const { getCards, createCard, deleteCard, putLike, deleteLike } = require('../controllers/cards');

router.get('/cards', getCards);
router.post('/cards', createCard);
router.delete('/cards/:cardId', deleteCard);

router.put('/cards/:cardId/likes', putLike);
router.delete('/cards/:cardId/likes', deleteLike);


module.exports = router;
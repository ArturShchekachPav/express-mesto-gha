const Card = require('../models/card');
const { NOT_FOUND_ERROR_CODE, INCORRECT_DATA_ERROR_CODE, DEFAULT_ERROR_CODE } = require('../utils/constants');

const getCards = (req, res) => Card.find({})
  .populate(['owner', 'likes'])
  .then((cards) => res.send(cards))
  .catch(() => res.status(DEFAULT_ERROR_CODE).send({ message: 'Ошибка сервера' }));

const createCard = (req, res) => {
  const { name, link } = req.body;
  const { _id } = req.user;

  return Card.create({ name, link, owner: _id })
    .then((newCard) => res.status(201).send(newCard))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(INCORRECT_DATA_ERROR_CODE).send({ message: 'Переданы некорректные данные при создании карточки' });
      }
      return res.status(DEFAULT_ERROR_CODE).send({ message: 'Ошибка сервера' });
    });
};

const deleteCardById = (req, res) => {
  const { cardId } = req.params;

  return Card.findByIdAndDelete(cardId)
    .then((card) => {
      if (!card) {
        return res.status(NOT_FOUND_ERROR_CODE).send({ message: 'Запрашиваемая карточка не найдена' });
      }

      return res.send(card);
    }).catch((err) => {
      if (err.name === 'CastError') {
        return res.status(INCORRECT_DATA_ERROR_CODE).send({ message: 'Переданы некорректные данные для удаления карточки' });
      }

      return res.status(DEFAULT_ERROR_CODE).send({ message: 'Ошибка сервера' });
    });
};

const likeCard = (req, res) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
  { new: true },
).then((card) => {
  if (!card) {
    return res.status(NOT_FOUND_ERROR_CODE).send({ message: 'Запрашиваемая карточка не найдена' });
  }

  return res.send(card);
}).catch((err) => {
  if (err.name === 'CastError') {
    return res.status(INCORRECT_DATA_ERROR_CODE).send({ message: 'Переданы некорректные данные для постановки лайка' });
  }

  return res.status(DEFAULT_ERROR_CODE).send({ message: 'Ошибка сервера' });
});

const dislikeCard = (req, res) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $pull: { likes: req.user._id } }, // добавить _id в массив, если его там нет
  { new: true },
).then((card) => {
  if (!card) {
    return res.status(NOT_FOUND_ERROR_CODE).send({ message: 'Запрашиваемая карточка не найдена' });
  }

  return res.send(card);
}).catch((err) => {
  if (err.name === 'CastError') {
    return res.status(INCORRECT_DATA_ERROR_CODE).send({ message: 'Переданы некорректные данные для постановки лайка' });
  }

  return res.status(DEFAULT_ERROR_CODE).send({ message: 'Ошибка сервера' });
});

module.exports = {
  getCards,
  createCard,
  deleteCardById,
  likeCard,
  dislikeCard,
};

const Card = require('../models/card');

const getCards = (req, res) => {
  return Card.find({})
    .populate('owner')
    .then((cards) => {
      return res.status(200).send(cards);
    })
    .catch(err => {
      return res.status(500).send({message: 'Ошибка сервера'})
    });
};

const createCard = (req, res) => {
  const {name, link} = req.body;
  const {_id} = req.user;

  return Card.create({name, link, owner: _id})
    .then((newCard) => {
      return res.status(201).send(newCard);
    })
    .catch((err) => {
      if(err.name === "ValidationError" || err.name === "CastError") {
        return res.status(400).send({message: 'Переданы некорректные данные при создании карточки'});
      }
      return res.status(500).send({message: "Ошибка сервера"});
    });
};

const deleteCardById = (req, res) => {
  const {cardId} = req.params;

  return Card.findByIdAndDelete(cardId)
    .then((card) => {
      if(!card) {
        return res.status(404).send({message: "Запрашиваемая карточка не найдена"});
      }

      return res.status(200).send(card);
   }).catch((err) => {
      if(err.name === "ValidationError" || err.name === "CastError") {
        return res.status(400).send({message: 'Переданы некорректные данные для удаления карточки'});
      }

     return res.status(500).send({ message: "Ошибка сервера"});
    });
};

const likeCard = (req, res) => {
  return Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  ).then((card) => {
    if(!card) {
      return res.status(404).send({message: "Запрашиваемая карточка не найдена"});
    }

    res.status(200).send(card);
  }).catch(err => {
    if(err.name === "ValidationError" || err.name === "CastError") {
      return res.status(400).send({message: 'Переданы некорректные данные для постановки лайка'});
    }

    return res.status(500).send({ message: "Ошибка сервера"});
  })
};

const dislikeCard = (req, res) => {
  return Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  ).then((card) => {
    if(!card) {
      return res.status(404).send({message: "Запрашиваемая карточка не найдена"});
    }

    res.status(200).send(card);
  }).catch(err => {
    if(err.name === "ValidationError" || err.name === "CastError") {
      return res.status(400).send({message: 'Переданы некорректные данные для постановки лайка'});
    }

    return res.status(500).send({ message: "Ошибка сервера"});
  })
};

module.exports = {
  getCards,
  createCard,
  deleteCardById,
  likeCard,
  dislikeCard
};
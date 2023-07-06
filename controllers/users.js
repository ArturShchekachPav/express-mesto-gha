const User = require('../models/user');
//npm i validator
const validator = require('validator');
// npm i bcypt
const bcrypt = require('bcrypt');
// npm i jsonwebtoken
const jwt = require('jsonwebtoken');

const { NOT_FOUND_ERROR_CODE, INCORRECT_DATA_ERROR_CODE, DEFAULT_ERROR_CODE } = require('../utils/constants');

const getUsers = (req, res) => User.find({})
  .then((users) => res.send(users)).catch(() => res.status(DEFAULT_ERROR_CODE).send({ message: 'Ошибка сервера' }));

const getUserById = (req, res) => {
  const { userId } = req.params;

  return User.findById(userId)
    .then((user) => {
      if (!user) {
        return res.status(NOT_FOUND_ERROR_CODE).send({ message: 'Запрашиваемый пользователь не найден' });
      }

      return res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(INCORRECT_DATA_ERROR_CODE).send({ message: 'Переданы некорректные данные для поиска пользователя пользователя' });
      }

      return res.status(DEFAULT_ERROR_CODE).send({ message: 'Ошибка сервера' });
    });
};

const createUser = (req, res) => {
  const newUserData = req.body;
  
  if(!validator.isEmail(newUserData.email)) {
    return res.status(INCORRECT_DATA_ERROR_CODE).send({ message: 'Передан некорректный email' });
  }
  
  bcrypt.hash(req.body.password)
  .then(hash => User.create(password: hash, ...newUserData))
    .then((newUser) => res.status(201).send(newUser))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(INCORRECT_DATA_ERROR_CODE).send({ message: 'Переданы некорректные данные для cоздания пользователя' });
      }
      return res.status(DEFAULT_ERROR_CODE).send({ message: 'Ошибка сервера' });
    });
};

const updateProfile = (req, res) => {
  const { name, about } = req.body;
  const { _id } = req.user;

  return User.findByIdAndUpdate(_id, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        return res.status(NOT_FOUND_ERROR_CODE).send({ message: 'Запрашиваемый профиль не найден' });
      }

      return res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        return res.status(INCORRECT_DATA_ERROR_CODE).send({ message: 'Переданы некорректные данные при обновлении профиля' });
      }
      return res.status(DEFAULT_ERROR_CODE).send({ message: 'Ошибка сервера' });
    });
};

const updateAvatar = (req, res) => {
  const { avatar } = req.body;
  const { _id } = req.user;

  return User.findByIdAndUpdate(_id, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        return res.status(NOT_FOUND_ERROR_CODE).send({ message: 'Запрашиваемый пользователь не найден' });
      }

      return res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        return res.status(INCORRECT_DATA_ERROR_CODE).send({ message: 'Переданы некорректные данные при обновлении аватара' });
      }

      return res.status(DEFAULT_ERROR_CODE).send({ message: 'Ошибка сервера' });
    });
};

const login = (req, red) => {
  const {email, password} = req.body;
  
  if(!validator.isEmail(email)) {
    return res.status(404).send({message: 'Передана некорректная почиа'});
  }
  
  return User.findUserByCredentials(email, password)
  .then(user =>{
    const token = jwt.sign({_id: user._id}, 'some-secret-key', {expiresIn: '7d'});
    
    res.send({token})
  })
  .catch(err => {
    res.status(401).send({message: err.message})
  })
}

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateProfile,
  updateAvatar,
  login
};

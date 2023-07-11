const User = require('../models/user');
const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const NotFoundError = require('../errors/not-found-error');
const IncorrectRequestError = require('../errors/incorrect-request-error');
const ConflictError = require('../errors/conflict-error');
const CREATED_CODE = require('../utils/constants');

const getUsers = (req, res, next) => User.find({})
  .then((users) => res.send(users)).catch(next);

const getUserById = (req, res, next) => {
  const { userId } = req.params;

  return User.findById(userId)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Нет пользователя с таким id');
      }

      return res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new IncorrectRequestError('Переданы некорректные данные для поиска пользователя пользователя'));
      }

      next(err);
    });
};

const createUser = (req, res, next) => {
  if(!validator.isEmail(req.body.email)) {
    return next(new IncorrectRequestError('Передан некорректный email'));
  }

  bcrypt.hash(req.body.password, 10)
    .then(hash => User.create({
      password: hash,
      email: req.body.email,gi
    }))
    .then((newUser) => res.status(CREATED_CODE).send(newUser))
    .catch((err) => {
      if (err.code === 11000) {
        next(new ConflictError('Пользователь с такой почтой уже зарегистрирован'))
      }

      if (err.name === 'ValidationError') {
        next(new IncorrectRequestError('Переданы некорректные данные для cоздания пользователя'));
      }

      next(err);
    });
};

const getMyProfileData = (req, res, next) => {
  const _id = req.user;

  return User.findById(_id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Запрашиваемый пользователь не найден');
      }

      return res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new IncorrectRequestError('Переданы некорректные данные для поиска пользователя пользователя'));
      }

      next(err);
    });
};

const updateProfile = (req, res, next) => {
  const { name, about } = req.body;
  const { _id } = req.user;

  return User.findByIdAndUpdate(_id, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Запрашиваемый профиль не найден');
      }

      return res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(new IncorrectRequestError('Переданы некорректные данные при обновлении профиля'));
      }
      next(err);
    });
};

const updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  const { _id } = req.user;

  return User.findByIdAndUpdate(_id, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Запрашиваемый пользователь не найден');
      }

      return res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(new IncorrectRequestError('Переданы некорректные данные при обновлении аватара'));
      }

      next(err);
    });
};

const login = (req, res, next) => {
  const {email, password} = req.body;

  if(!validator.isEmail(email)) {
    return next(new IncorrectRequestError('Передана некорректная почта'));
  }

  return User.findUserByCredentials(email, password)
  .then(user =>{
    const token = jwt.sign({_id: user._id}, 'some-secret-key', {expiresIn: '7d'});

    res.cookie('jwt', token, {
        maxAge: 3600000,
        httpOnly: true
      }).end();
  })
  .catch(next)
}

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateProfile,
  updateAvatar,
  login,
  getMyProfileData
};

const User = require('../models/user');

const getUsers = (req, res) => {
  return User.find({})
    .then((users) => {
      return res.status(200).send(users);
    }).catch(err => {
      return res.status(500).send({message: 'Ошибка сервера'})
    });
};

const getUserById = (req, res) => {
  const {userId} = req.params;

  return User.findById(userId)
    .then((user) => {
      return res.status(200).send(user);
    })
    .catch((err) => {
      if(err.name === "CastError") {
        return res.status(404).send({message: "Запрашиваемый пользователь не найден"});
      }

      return res.status(500).send({message: "Ошибка сервера"});
    });
};

const createUser = (req, res) => {
  const newUserData = req.body;

  return User.create(newUserData)
    .then((newUser) => {
    return res.status(201).send(newUser);
    })
    .catch((err) => {
      console.log(err);
      if(err.name === "ValidationError") {
        return res.status(400).send({message: 'Переданы некорректные данные при создании пользователя'});
      }
      return res.status(500).send({message: "Ошибка сервера"});
    });
};

const updateProfile = (req, res) => {
  const {name, about} = req.body;
  const {_id} = req.user;

  return User.findByIdAndUpdate(_id, { name, about }, {new: true, runValidators: true})
    .then(user => {
      return res.status(200).send(user)
    })
    .catch(err => {
      if(err.name === "ValidationError") {
        return res.status(400).send({message: 'Переданы некорректные данные при обновлении профиля'});
      } else if(err.name === "CastError") {
        return res.status(404).send({message: "Запрашиваемый пользователь не найден"});
      }

      return res.status(500).send({message: 'Ошибка сервера'})
    });
};

const updateAvatar = (req, res) => {
  const {avatar} = req.body;
  const {_id} = req.user;

  return User.findByIdAndUpdate(_id, { avatar }, {new: true, runValidators: true})
    .then(user => {
      return res.status(200).send(user)
    })
    .catch(err => {
      if(err.name === "ValidationError") {
        return res.status(400).send({message: 'Переданы некорректные данные при обновлении аватара'});
      } else if(err.name === "CastError") {
        return res.status(404).send({message: "Запрашиваемый пользователь не найден"});
      }

      return res.status(500).send({message: 'Ошибка сервера'})
    });
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateProfile,
  updateAvatar
}
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const IncorrectRequestError = require('../errors/incorrect-request-error');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    required: true,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    validate: {
      validator: function (value) {
        return /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/.test(value);
      },
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
});

userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({email}).select('+password')
  .then((user) => {
    if(!user) {
      throw new IncorrectRequestError('Неправильные почта или пароль');
    }

    return bcrypt.compare(password, user.password).then(matched => {
      if(!matched) {
        throw new IncorrectRequestError('Неправильные почта или пароль');
      }

      return user;
    });
  });
};

module.exports = mongoose.model('user', userSchema);

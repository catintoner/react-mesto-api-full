const { isEmail } = require('validator');

const bcrypt = require('bcryptjs');

const mongoose = require('mongoose');

const InccorectInfoError = require('../errors/IncorrectInfoError');

const { isValidityUrl } = require('../utils/constants');

const userSchema = new mongoose.Schema({

  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: isEmail,
    },
  },

  password: {
    type: String,
    select: false,
    required: true,
  },

  name: {
    type: String,
    default: 'Жак-Ив Кусто',
    minlength: 2,
    maxlength: 30,
  },

  about: {
    type: String,
    default: 'Исследователь',
    minlength: 2,
    maxlength: 30,
  },

  avatar: {
    type: String,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    validate: {
      validator(v) {
        return isValidityUrl.test(v);
      },
    },
  },
}, { versionKey: false });

userSchema.statics.findUserByCredentials = function findUserByCredentials(email, password, next) {
  return this.findOne({ email }).select('password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new InccorectInfoError('Неправильные почта или пароль'));
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new InccorectInfoError('Неправильные почта или пароль'));
          }

          return user;
        })
        .catch(next);
    });
};

module.exports = mongoose.model('user', userSchema);

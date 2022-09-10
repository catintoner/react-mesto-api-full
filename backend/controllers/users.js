const bcrypt = require('bcryptjs');

const jwt = require('jsonwebtoken');

const User = require('../models/user');

const ValidateError = require('../errors/ValidateError');
const NotFoundError = require('../errors/NotFoundError');
const UniqueEmailError = require('../errors/UniqueEmailError');

const {
  OK,
  CREATED_CODE,
  JWT,
  isProduction,
} = require('../utils/constants');

module.exports.login = (request, response, next) => {
  const { email, password } = request.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        {
          _id: user._id,
        },
        JWT,
        {
          expiresIn: '7d',
        },
      );
      response.cookie('jwt', token, {
        maxAge: 3600000 * 24 * 7,
        httpOnly: true,
        secure: isProduction,
      }).status(OK).send(user._id);
    })
    .catch(next);
};

module.exports.getUsers = (request, response, next) => {
  User.find({})
    .then((users) => {
      if (!users) {
        throw new NotFoundError('Пользователи не найдены');
      }
      response.status(OK).send({ users });
    })
    .catch(next);
};

module.exports.createUser = (request, response, next) => {
  bcrypt.hash(request.body.password, 10)
    .then((hash) => {
      User.create({
        email: request.body.email,
        password: hash,
        name: request.body.name,
        about: request.body.about,
        avatar: request.body.avatar,

      })
        .then((userInfo) => {
          const user = userInfo.toObject();
          delete user.password;
          response.status(CREATED_CODE).send(user);
        })
        .catch((err) => {
          if (err.code === 11000) {
            next(new UniqueEmailError('Пользователь с таким Email уже существует'));
            return;
          }
          if (err.name === 'ValidationError') {
            next(new ValidateError('Указанные данные не корректны'));
          } else {
            next(err);
          }
        });
    })
    .catch(next);
};

module.exports.getUserById = (request, response, next) => {
  User.findById(request.params.userId)
    .orFail(new NotFoundError('Пользователь не найден'))
    .then((user) => {
      response.status(OK).send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new ValidateError('Указанные данные не корректны'));
      } else {
        next(err);
      }
    });
};

module.exports.getUserInfo = (request, response, next) => {
  User.findById(request.user._id)
    .orFail(new NotFoundError('Пользователь не найден'))
    .then((user) => {
      response.status(OK).send(user);
    })
    .catch((err) => {
      next(err);
    });
};

module.exports.updateUserProfile = (request, response, next) => {
  const { name, about } = request.body;
  User.findByIdAndUpdate(request.user._id, { name, about }, {
    new: true,
    runValidators: true,
  })
    .orFail(new NotFoundError('Пользователь не найден'))
    .then((user) => {
      response.status(OK).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidateError('Указанные данные не корректны'));
      } else {
        next(err);
      }
    });
};

module.exports.updateUserAvatar = (request, response, next) => {
  const { avatar } = request.body;
  User.findByIdAndUpdate(request.user._id, { avatar }, {
    new: true,
    runValidators: true,
  })
    .orFail(new NotFoundError('Пользователь не найден'))
    .then((user) => {
      response.status(OK).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidateError('Указанные данные не корректны'));
      } else {
        next(err);
      }
    });
};

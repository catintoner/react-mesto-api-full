const Card = require('../models/card');

const ValidateError = require('../errors/ValidateError');
const NotFoundError = require('../errors/NotFoundError');
const DeleteForeignCard = require('../errors/DeleteForeignCard');

const { OK, CREATED_CODE } = require('../utils/constants');

module.exports.getCards = (request, response, next) => {
  Card.find({})
    .then((cards) => {
      response.status(OK).send(cards);
    })
    .catch(next);
};

module.exports.getCardById = (request, response, next) => {
  Card.findById(request.params.cardId)
    .orFail(new NotFoundError('Данная карточка не найдена'))
    .then((card) => {
      response.status(OK).send(card);
    })
    .catch(next);
};

module.exports.deleteCardById = (request, response, next) => {
  Card.findById(request.params.cardId)
    .orFail(new NotFoundError('Данная карточка не найдена'))
    .then((card) => {
      const ownerId = card.owner.toString();
      if (ownerId === request.user._id) {
        Card.findByIdAndDelete(card)
          .then(() => response.status(OK).send({ message: 'Карточка удалена' }))
          .catch(next);
      } else {
        throw new DeleteForeignCard('Нет прав для удаления карточки');
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new ValidateError('Указанные данные не корректны'));
      } else {
        next(err);
      }
    });
};

module.exports.createCard = (request, response, next) => {
  const { name, link } = request.body;
  const owner = request.user._id;
  Card.create({ name, link, owner })
    .then((card) => {
      response.status(CREATED_CODE).send(card);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidateError('Указанные данные не корректны'));
      } else {
        next(err);
      }
    });
};

module.exports.likeCard = (request, response, next) => {
  Card.findByIdAndUpdate(
    request.params.cardId,
    { $addToSet: { likes: request.user._id } },
    { new: true },
  )
    .orFail(new NotFoundError('Карточка не найдена'))
    .then((card) => {
      response.status(OK).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new ValidateError('Указанные данные не корректны'));
      } else {
        next(err);
      }
    });
};

module.exports.dislikeCard = (request, response, next) => {
  Card.findByIdAndUpdate(
    request.params.cardId,
    { $pull: { likes: request.user._id } },
    { new: true },
  )
    .orFail(new NotFoundError('Карточка не найдена'))
    .then((card) => {
      response.status(OK).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new ValidateError('Указанные данные не корректны'));
      } else {
        next(err);
      }
    });
};

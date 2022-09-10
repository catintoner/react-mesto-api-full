const cardRouter = require('express').Router();

const { Joi, celebrate } = require('celebrate');

const {
  getCards,
  getCardById,
  deleteCardById,
  createCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

const { isValidityUrl } = require('../utils/constants');

const validationCardId = {
  params: Joi.object().keys({
    cardId: Joi.string().hex().length(24),
  }),
};

cardRouter.get('/', getCards);

cardRouter.get(
  '/:cardId',
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().hex().length(24),
    }),
  }),
  getCardById,
);

cardRouter.post(
  '/',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      link: Joi.string().required().regex(isValidityUrl),
    }),
  }),
  createCard,
);

cardRouter.delete(
  '/:cardId',
  celebrate(validationCardId),
  deleteCardById,
);

cardRouter.put(
  '/:cardId/likes',
  celebrate(validationCardId),
  likeCard,
);

cardRouter.delete(
  '/:cardId/likes',
  celebrate(validationCardId),
  dislikeCard,
);

module.exports = cardRouter;

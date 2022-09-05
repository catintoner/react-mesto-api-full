const jwt = require('jsonwebtoken');

const InccorectInfoError = require('../errors/IncorrectInfoError');

const { NODE_ENV, JWT_SECRET } = process.env;

const handleAuthError = () => {
  throw new InccorectInfoError('Необходима авторизация');
};

const extractBearerToken = (header) => header.replace('Bearer ', '');

module.exports = (request, response, next) => {
  const authorization = request.cookies.jwt;
  if (!authorization) {
    handleAuthError();
    return;
  }

  const token = extractBearerToken(authorization);
  let payload;

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
  } catch (err) {
    handleAuthError();
    return;
  }

  request.user = payload;

  next();
};

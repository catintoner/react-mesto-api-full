const { NODE_ENV, JWT_SECRET } = process.env;

const SERVER_ERROR = 500;
const CREATED_CODE = 201;
const OK = 200;

const DEFAULT_ALLOWED_METHODS = 'GET, HEAD, PUT, PATCH, POST, DELETE';

const allowedCors = [
  'https://praktikum.tk',
  'http://praktikum.tk',
  'http://localhost:3000',
  'https://catintoner.nomorepartiesxyz.ru',
  'http://catintoner.nomorepartiesxyz.ru',
];

const isProduction = NODE_ENV === 'production';

const JWT = isProduction ? JWT_SECRET : 'dev-secret';

module.exports = {
  SERVER_ERROR,
  CREATED_CODE,
  OK,
  DEFAULT_ALLOWED_METHODS,
  allowedCors,
  isProduction,
  JWT,
};

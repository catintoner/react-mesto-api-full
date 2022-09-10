require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');

const auth = require('./middlewares/auth');
const cors = require('./middlewares/cors');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const router = require('./routes/users');
const cardRouter = require('./routes/cards');

const { login, createUser } = require('./controllers/users');

const { OK, SERVER_ERROR, SERVER_PORT } = require('./utils/constants');
const NotFoundError = require('./errors/NotFoundError');
const { validateAuth, validateUserBody } = require('./middlewares/validations');

const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('*', cors);

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.use(requestLogger);

app.post(
  '/signin',
  validateAuth,
  login,
);

app.post(
  '/signup',
  validateUserBody,
  createUser,
);

app.get('/signout', (request, response) => {
  response.clearCookie('jwt').status(OK).send({ message: 'Выход' });
});

app.use(cookieParser());

app.use('/', auth);

app.use('/users', router);

app.use('/cards', cardRouter);

app.use('*', (request, response, next) => {
  next(new NotFoundError('Запрашиваемая страница не найдена'));
});

app.use(errorLogger);

app.use(errors());

app.use((err, request, response, next) => {
  if (err.statusCode) {
    response.status(err.statusCode).send({ message: err.message });
  } else {
    response.status(SERVER_ERROR).send({ message: 'Произошла ошибка' });
  }
  next();
});

app.listen(SERVER_PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`its my server on port ${SERVER_PORT}`);
});

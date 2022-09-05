const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { Joi, celebrate, errors } = require('celebrate');

const auth = require('./middlewares/auth');
const cors = require('./middlewares/cors');

const router = require('./routes/users');
const cardRouter = require('./routes/cards');

const { login, createUser } = require('./controllers/users');

const { SERVER_ERROR } = require('./utils/constants');
const NotFoundError = require('./errors/NotFoundError');

const { PORT = 3001 } = process.env;
const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors);

app.post(
  '/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required(),
    }),
  }),
  login,
);

app.post(
  '/signup',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required(),
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(30),
      avatar: Joi.string().pattern(/^https?:\/\/(www.)?([\S\w-._~:/?#[\]@!$&'()*+,;=])*(#)?$/),
    }),
  }),
  createUser,
);

app.use(cookieParser());

app.use('/', auth);

app.use('/users', auth, router);

app.use('/cards', auth, cardRouter);

app.use('*', (request, response, next) => {
  next(new NotFoundError('Запрашиваемая страница не найдена'));
});

app.use(errors());

app.use((err, request, response, next) => {
  if (err.statusCode) {
    response.status(err.statusCode).send({ message: err.message });
  } else {
    response.status(SERVER_ERROR).send({ message: 'Произошла ошибка' });
  }
  next();
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`its my server on port ${PORT}`);
});

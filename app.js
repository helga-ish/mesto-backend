const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const {
  celebrate,
  Joi,
  errors,
} = require('celebrate');

const {
  login,
  createUser,
} = require('./controllers/users');
const auth = require('./middlewares/auth');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const processErrors = require('./middlewares/processErrors');
const NotFoundError = require('./components/NotFoundError');

const { PORT = 3000 } = process.env;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
});

app.use(requestLogger);

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
}), login);

app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
    name: Joi.string().min(2).max(30).default('Жак-Ив Кусто'),
    about: Joi.string().min(2).max(30).default('Исследователь'),
    avatar: Joi.string().pattern(/(^https?:\/\/)?(www\.)?[a-z0-9~_\-.]+\.[a-z]{2,9}([!-~]*)?$/i).default('https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png'),
  }).unknown(true),
}), createUser);

app.use('/', auth, require('./routes/users'));
app.use('/', auth, require('./routes/cards'));

app.use('*', (req, res, next) => next(new NotFoundError()));

app.use(errorLogger);

app.use(errors());
app.use(processErrors);

app.listen(PORT);

const path = require('path');
const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const { StatusCodes } = require('http-status-codes');

const productRoute = require('./routes/product.route');
const categoryRoute = require('./routes/category.route');
const userRoute = require('./routes/user.route');
const AppError = require('./utils/AppError');
const handlerErr = require('./controllers/error.controller');
const viewRoute = require('./routes/view.route');

const app = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));

if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

app.use(express.json());
app.use(cookieParser());

app.use('/', viewRoute);
app.use('/api/v1/products', productRoute);
app.use('/api/v1/categories', categoryRoute);
app.use('/api/v1/users', userRoute);
app.all('*', (req, res, next) => {
  const message = `Can't find ${req.originalUrl} on this server`;
  const statusCode = StatusCodes.NOT_FOUND;
  next(new AppError(message, statusCode));
});

app.use(handlerErr);

module.exports = app;

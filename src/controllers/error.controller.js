const { StatusCodes } = require('http-status-codes');
const AppError = require('../utils/AppError');

const handleCastErr = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, StatusCodes.BAD_REQUEST);
};

const handleDuplicateErr = (err) => {
  const field = Object.keys(err.keyValue)[0];
  let message;
  if (field === 'title') message = `${field}: Tiêu đề đã tồn tại`;
  if (field === 'isbn') message = `${field}: Mã isbn đã tồn tại`;
  return new AppError(message, StatusCodes.BAD_REQUEST);
};

const handleValidationErr = (err) => {
  const messages = Object.values(err.errors).map((el) => {
    if (el.name === 'CastError') {
      if (el.kind === 'Number') return `${el.path}: Cần phải nhập một số`;
      if (el.kind === 'String') return `${el.path}: Cần phải nhập một chuỗi`;
      if (el.kind === 'ObjectId') return `${el.path}: Giá trị không hợp lệ`;
    }
    return el.message;
  });
  return new AppError(messages.join('.'), StatusCodes.BAD_REQUEST);
};

const handleJWTErr = () => {
  const message = 'Token không hợp lệ. Hãy thử đăng nhập lại';
  return new AppError(message, StatusCodes.UNAUTHORIZED);
};

const handleTokenExpiredErr = () => {
  const message = 'Token của bạn đã hết hạn. Vui lòng đăng nhập lại';
  return new AppError(message, StatusCodes.UNAUTHORIZED);
};

const sendErrDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    error: err,
    stack: err.stack,
  });
};

const renderErrDev = (err, res) => {
  res.status(err.statusCode).render('error', {
    code: err.statusCode,
    title: 'Có gì đó không ổn',
    message: err.message,
  });
};

const sendErrProd = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
};

const renderErrProd = (err, res) => {};

const handlerErrDev = (err, req, res) => {
  const errDev = err;
  if (!errDev.isOperational) {
    errDev.statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
    errDev.status = 'error';
  }

  if (req.originalUrl.startsWith('/api')) {
    sendErrDev(errDev, res);
  } else renderErrDev(errDev, res);
};

const handlerErrProd = (err, req, res) => {
  const errProd = err;
  if (!errProd.isOperational) {
    errProd.statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
    errProd.status = 'error';
    errProd.message = 'Đã xảy ra lỗi. Vui lòng thử lại!';
  }

  if (req.originalUrl.startsWith('/api')) {
    sendErrProd(errProd, res);
  } else {
    renderErrProd(errProd, res);
  }
};

const handlerErr = (err, req, res, next) => {
  let error = err;
  if (err.name === 'CastError') error = handleCastErr(err);
  if (err.code === 11000) error = handleDuplicateErr(err);
  if (err.name === 'ValidationError') error = handleValidationErr(err);
  if (err.name === 'JsonWebTokenError') error = handleJWTErr();
  if (err.name === 'TokenExpiredError') error = handleTokenExpiredErr();

  if (process.env.NODE_ENV === 'development') handlerErrDev(error, req, res);
  if (process.env.NODE_ENV === 'production') handlerErrProd(error, req, res);
};

module.exports = handlerErr;

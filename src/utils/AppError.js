const { StatusCodes } = require('http-status-codes');

class AppError extends Error {
  constructor(message, statusCode, stack, isOperational = true) {
    super(message);

    this.statusCode = statusCode;
    this.status = statusCode >= 400 && statusCode <= 499 ? 'fail' : 'error';
    this.isOperational = isOperational;

    if (stack) this.stack = stack;
    else Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;

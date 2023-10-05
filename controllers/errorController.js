const AppError = require('../utils/appError');

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err) => {
  const value = err.keyValue.name;
  const message = `Duplicate field value: ${value}. Please use another value!`;
  return new AppError(message, 400);
};

const handleValidationError = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid Input data. ${errors.join('. ')}`;
  return new AppError(message, 400);
};

const handleJWTError = () =>
  new AppError('Invalid token. Please login again!', 401);

const handleJWTExpiredError = () =>
  new AppError('Your token has expired! Please log in again', 401);

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  //Operational, trusted error: send message to client
  // console.log('ALUE', err.value, err.statusCode, err.message);

  if (err.value || err.path) {
    err.statusCode = 400;
    err.message = `Invalid ${err.path}: ${err.value}`;
  }

  if (err.isOperational || err.value || err.path) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });

    //Programming or other unknow error: don't leak error details
  } else {
    // 1) Log error
    // 2) Send generic message
    res
      .status(500)
      .json({ status: 'error', message: 'Something went very wrong!' });
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    if (err.name === 'JsonWebTokenError') {
      sendErrorProd(handleJWTError(), res);
    }

    if (err.name === 'TokenExpiredError') {
      sendErrorProd(handleJWTExpiredError(), res);
    }

    if (err instanceof ReferenceError) {
      sendErrorProd(err, res);
    }

    let error = { ...err };

    if (error.name === 'CastError') error = handleCastErrorDB(error);

    if (error.code === 11000) error = handleDuplicateFieldsDB(error);

    const validationErrKey = Object.keys(error.errors)[0];
    if (error.errors[validationErrKey].name === 'ValidatorError') {
      error = handleValidationError(error);
    }

    sendErrorProd(error, res);
  }
};

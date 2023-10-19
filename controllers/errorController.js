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

const sendErrorDev = (err, req, res) => {
  //API
  if (req.originalUrl.startsWith('/api')) {
    res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  } else {
    //RENDERED WEBSITE
    res.status(err.statusCode).render('error', {
      title: 'Something went wrong!',
      msg: err.message,
    });
  }
};

const sendErrorProd = (err, req, res) => {
  //A) For API
  //Operational, trusted error: send message to client
  // console.log('ALUE', err.value, err.statusCode, err.message);
  if (req.originalUrl.startsWith('/api')) {
    if (err.value || err.path) {
      err.statusCode = 400;
      err.message = `Invalid ${err.path}: ${err.value}`;
    }

    if (err.isOperational || err.value || err.path) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    }

    // 1) Log error
    // 2) Send generic message
    //Programming or other unknow error: don't leak error details
    return res
      .status(500)
      .json({ status: 'error', message: 'Something went very wrong!' });
  }

  // B) RENDERED WEBSITE
  if (err.value || err.path) {
    return res.status(400).render('error', {
      title: 'Something went wrong!',
      msg: `Invalid ${err.path}: ${err.value}`,
    });
  }

  if (err.isOperational || err.value || err.path) {
    return res.status(err.statusCode).render('error', {
      title: 'Something went wrong!',
      msg: err.message,
    });
  }

  // 2) Send generic message
  // console.error('ERROR 🎇', err);
  return res.status(err.statusCode).render('error', {
    title: 'Something went wrong!',
    msg: 'Please try again later.',
  });
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, req, res);
  } else if (process.env.NODE_ENV === 'production') {
    if (err.name === 'JsonWebTokenError') {
      sendErrorProd(handleJWTError(), res);
    }

    if (err.name === 'TokenExpiredError') {
      sendErrorProd(handleJWTExpiredError(), res);
    }

    if (err instanceof ReferenceError) {
      sendErrorProd(err, req, res);
    }

    let error = { message: err.message, ...err };

    if (error.name === 'CastError') error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);

    if (!error.isOperational) {
      const validationErrKey = Object.keys(error.errors)[0];
      if (error.errors[validationErrKey].name === 'ValidatorError') {
        error = handleValidationError(error);
      }
    }

    console.log(error.message);
    sendErrorProd(error, req, res);
  }
};

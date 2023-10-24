const path = require('path');
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const helmetCsp = require('helmet-csp');
const cookieParser = require('cookie-parser');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const bookingRouter = require('./routes/bookingRoutes');
const viewRouter = require('./routes/viewRoutes');

const app = express();

//Template render enginee setup
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// 1) GLOBAL MIDDLEWARES
// Set Security HTTP headers
app.use(helmet());
// Configure the Content Security Policy
// app.use(helmetCsp());

const csp = helmetCsp({
  directives: {
    defaultSrc: [
      "'self'",
      'https://fonts.googleapis.com',
      'https://unpkg.com',
      'https://fonts.gstatic.com',
      'https://js.stripe.com',
    ],
    scriptSrc: [
      "'self'",
      'https://unpkg.com',
      'https://cdnjs.cloudflare.com',
      'https://js.stripe.com',
    ],
    fontSrc: [
      "'self'",
      'https://fonts.googleapis.com',
      'https://fonts.gstatic.com',
    ],
    imgSrc: [
      "'self'",
      'https://tile.openstreetmap.org/',
      'https://unpkg.com/',
      'http://localhost:3000/img/icons.svg',
      'data:',
    ],
    // styleSrc: [
    //   "'self'",
    //   'https://fonts.googleapis.com',
    //   'https://unpkg.com',
    //   'https://fonts.gstatic.com',
    //   'http://localhost:3000',
    //   'unsafe-inline',
    // ], // Allow unsafe-inline for inline styles
  },
});

app.use(csp);

// Serving static files
app.use(express.static(path.join(__dirname, 'public')));

// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Limit requests from same IP
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!',
});

app.use('/api', limiter);

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

// Data Sanitization against NosQL query injection
app.use(mongoSanitize());

// Data Sanitization agains XSS
app.use(xss());

// Prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  }),
);

// Test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

app.use('/', viewRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/bookings', bookingRouter);

app.use('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;

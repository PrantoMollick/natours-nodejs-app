const express = require('express');
const viewsController = require('../controllers/viewsController');
const authContoller = require('../controllers/authController');
const bookingController = require('../controllers/bookingController');

const router = express.Router();

router.route('/me').get(authContoller.protect, viewsController.getAccount);
router.post(
  '/submit-user-data',
  authContoller.protect,
  viewsController.updateUserData,
);

router.route('/').get(
  // bookingController.createBookingCheckout,
  authContoller.isLoggedIn,
  viewsController.getOverview,
);

router
  .route('/tour/:slug')
  .get(authContoller.isLoggedIn, viewsController.getTour);

router
  .route('/login')
  .get(authContoller.isLoggedIn, viewsController.getLoginForm);

router.get('/my-tours', authContoller.protect, viewsController.getMyTours);

module.exports = router;

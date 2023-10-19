const express = require('express');
const viewsController = require('../controllers/viewsController');
const authContoller = require('../controllers/authController');

const router = express.Router();

router.route('/me').get(authContoller.protect, viewsController.getAccount);
router.post(
  '/submit-user-data',
  authContoller.protect,
  viewsController.updateUserData,
);

router.use(authContoller.isLoggedIn);
router.route('/').get(viewsController.getOverview);
router.route('/tour/:slug').get(viewsController.getTour);
router.route('/login').get(viewsController.getLoginForm);

module.exports = router;

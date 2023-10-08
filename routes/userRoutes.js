const express = require('express');
const userController = require('../controllers/userController');
const authContoller = require('../controllers/authController');

const router = express.Router();

router.post('/signup', authContoller.signup);
router.post('/login', authContoller.login);

router.post('/forgotPassword', authContoller.forgotPassword);
router.patch('/resetPassword/:token', authContoller.resetPassword);
router.patch('/updateMe', authContoller.protect, userController.updateMe);

router.patch(
  '/updateMyPassword',
  authContoller.protect,
  authContoller.updatePassword,
);

router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser);

router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;

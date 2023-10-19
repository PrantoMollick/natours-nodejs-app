const express = require('express');

const userController = require('../controllers/userController');
const authContoller = require('../controllers/authController');

const router = express.Router();

router.post('/signup', authContoller.signup);
router.post('/login', authContoller.login);
router.get('/logout', authContoller.logout);

router.post('/forgotPassword', authContoller.forgotPassword);
router.patch('/resetPassword/:token', authContoller.resetPassword);

// protect all routes after this middleware
router.use(authContoller.protect);

router.get('/me', userController.getMe, userController.getUser);
router.patch(
  '/updateMe',
  userController.uploadUserPhoto,
  userController.updateMe,
);
router.delete('/deleteMe', userController.deleteMe);
router.patch('/updateMyPassword', authContoller.updatePassword);

router.use(authContoller.restrictTo('admin'));
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

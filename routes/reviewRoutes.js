const express = require('express');
const reviewController = require('../controllers/reviewController');
const authController = require('../controllers/authController');

const router = express.Router({ mergeParams: true });

// POST /tour/jsdlkfjsajf/reviews
// POST /reviews

router
  .route('/')
  .get(reviewController.getAllreviews)
  .post(
    authController.protect,
    authController.restrictTo('user'),
    reviewController.createReviews,
  );

router.route('/:id').delete(reviewController.deleteReview);

module.exports = router;

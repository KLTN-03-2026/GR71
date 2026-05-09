const express = require('express');
const router = express.Router();

const { asyncHandler, authUser } = require('../auth/checkAuth');
const feedbackController = require('../controller/feedback.controller');

// Public
router.get('/reviews', asyncHandler(feedbackController.getReviewsPage));
router.get('/product/:productId', asyncHandler(feedbackController.getFeedbackByProductId));

// Auth required
router.post('/create', authUser, asyncHandler(feedbackController.createFeedback));
router.get('/my-reviews', authUser, asyncHandler(feedbackController.getUserReviews));
router.get('/check-review/:paymentId', authUser, asyncHandler(feedbackController.checkUserReview));
router.delete('/:reviewId', authUser, asyncHandler(feedbackController.deleteReview));

// Admin
router.get('/get-all-feedback', asyncHandler(feedbackController.getAllFeedback));

module.exports = router;

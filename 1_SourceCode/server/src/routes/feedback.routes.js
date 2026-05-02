const express = require('express');
const router = express.Router();

const { asyncHandler, authAdmin, authUser } = require('../auth/checkAuth');

const feedbackController = require('../controller/feedback.controller');

router.post('/create', authUser, asyncHandler(feedbackController.createFeedback));
router.get('/get-all-feedback', asyncHandler(feedbackController.getAllFeedback));

module.exports = router;

const Feedback = require('../models/feedback.model');

class FeedbackService {
    async createFeedback(userId, productId, rating, content) {
        const feedback = await Feedback.create({ userId, productId, rating, content });
        return feedback;
    }

    async getAllFeedback() {
        const feedback = await Feedback.find().populate('userId').populate('productId');
        return feedback;
    }
}

module.exports = new FeedbackService();

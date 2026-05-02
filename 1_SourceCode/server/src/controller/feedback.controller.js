const FeedbackService = require('../services/feedback.service');

const { OK } = require('../core/success.response');

class FeedbackController {
    async createFeedback(req, res) {
        const { id } = req.user;
        const { productId, rating, content } = req.body;
        const feedback = await FeedbackService.createFeedback(id, productId, rating, content);
        new OK({ message: 'success', metadata: feedback }).send(res);
    }

    async getAllFeedback(req, res) {
        const feedback = await FeedbackService.getAllFeedback();
        new OK({ message: 'success', metadata: feedback }).send(res);
    }
}

module.exports = new FeedbackController();

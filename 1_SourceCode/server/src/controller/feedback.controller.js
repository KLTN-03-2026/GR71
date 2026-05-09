const FeedbackService = require('../services/feedback.service');
const { OK } = require('../core/success.response');

class FeedbackController {
    async createFeedback(req, res) {
        const { id } = req.user;
        const { productId, rating, content, paymentId } = req.body;
        const feedback = await FeedbackService.createFeedback(id, productId, rating, content, paymentId);
        new OK({ message: 'success', metadata: feedback }).send(res);
    }

    async getAllFeedback(req, res) {
        const feedback = await FeedbackService.getAllFeedback();
        new OK({ message: 'success', metadata: feedback }).send(res);
    }

    async getFeedbackByProductId(req, res) {
        const { productId } = req.params;
        const feedback = await FeedbackService.getFeedbackByProductId(productId);
        new OK({ message: 'success', metadata: feedback }).send(res);
    }

    async checkUserReview(req, res) {
        const { id } = req.user;
        const { paymentId } = req.params;
        const reviews = await FeedbackService.checkUserReview(id, paymentId);
        new OK({ message: 'success', metadata: reviews }).send(res);
    }

    async getReviewsPage(req, res) {
        const { page, limit, star, sort } = req.query;
        const data = await FeedbackService.getReviewsPage({ page, limit, star, sort });
        new OK({ message: 'success', metadata: data }).send(res);
    }

    async getUserReviews(req, res) {
        const { id } = req.user;
        const data = await FeedbackService.getUserReviews(id);
        new OK({ message: 'success', metadata: data }).send(res);
    }

    async deleteReview(req, res) {
        const { id } = req.user;
        const { reviewId } = req.params;
        const data = await FeedbackService.deleteReview(id, reviewId);
        new OK({ message: 'success', metadata: data }).send(res);
    }
}

module.exports = new FeedbackController();

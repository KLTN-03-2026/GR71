const Feedback = require('../models/feedback.model');
const Payment = require('../models/payment.model');
const { BadRequestError, ForbiddenError } = require('../core/error.response');

class FeedbackService {
    async createFeedback(userId, productId, rating, content, paymentId) {
        // Xác minh user thực sự có đơn hàng completed chứa tour này
        const validPayment = await Payment.findOne({
            _id: paymentId,
            user: userId,
            paymentStatus: 'completed',
            'items.product': productId,
        });
        if (!validPayment) {
            throw new BadRequestError('Bạn cần hoàn thành chuyến đi trước khi đánh giá!');
        }

        // Chống review trùng lặp trên cùng 1 đơn hàng
        const existing = await Feedback.findOne({ userId, productId, paymentId });
        if (existing) {
            throw new BadRequestError('Bạn đã đánh giá tour này rồi!');
        }

        return await Feedback.create({ userId, productId, rating, content, paymentId });
    }

    async getAllFeedback() {
        return await Feedback.find().populate('userId').populate('productId');
    }

    async getFeedbackByProductId(productId) {
        return await Feedback.find({ productId }).populate('userId').sort({ createdAt: -1 });
    }

    async checkUserReview(userId, paymentId) {
        return await Feedback.find({ userId, paymentId }).select('productId rating');
    }

    // Trang đánh giá công khai — có phân trang, lọc sao, sắp xếp
    async getReviewsPage({ page = 1, limit = 12, star, sort = 'newest' }) {
        const query = star ? { rating: Number(star) } : {};
        const sortMap = {
            newest: { createdAt: -1 },
            oldest: { createdAt: 1 },
            highest: { rating: -1, createdAt: -1 },
            lowest: { rating: 1, createdAt: -1 },
        };
        const sortOption = sortMap[sort] || sortMap.newest;

        const [reviews, total] = await Promise.all([
            Feedback.find(query)
                .populate('userId', 'fullName avatar')
                .populate('productId', 'title images destination')
                .sort(sortOption)
                .skip((Number(page) - 1) * Number(limit))
                .limit(Number(limit)),
            Feedback.countDocuments(query),
        ]);

        // Thống kê tổng thể (không phụ thuộc bộ lọc)
        const allRatings = await Feedback.find({}).select('rating');
        const totalAll = allRatings.length;
        const avgRating =
            totalAll > 0 ? allRatings.reduce((s, r) => s + r.rating, 0) / totalAll : 0;
        const distribution = [5, 4, 3, 2, 1].map((s) => ({
            star: s,
            count: allRatings.filter((r) => r.rating === s).length,
        }));

        return {
            reviews,
            total,
            page: Number(page),
            limit: Number(limit),
            stats: { avgRating, totalAll, distribution },
        };
    }

    // Đánh giá của một user cụ thể
    async getUserReviews(userId) {
        return await Feedback.find({ userId })
            .populate('productId', 'title images destination')
            .sort({ createdAt: -1 });
    }

    // Xóa đánh giá — chỉ chủ sở hữu mới xóa được
    async deleteReview(userId, reviewId) {
        const review = await Feedback.findById(reviewId);
        if (!review) throw new BadRequestError('Không tìm thấy đánh giá!');
        if (review.userId.toString() !== userId.toString()) {
            throw new ForbiddenError('Bạn không có quyền xóa đánh giá này!');
        }
        await Feedback.findByIdAndDelete(reviewId);
        return { success: true };
    }
}

module.exports = new FeedbackService();

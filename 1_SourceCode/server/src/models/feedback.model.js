const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const modelFeedback = new Schema(
    {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: 'product', required: true },
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
        paymentId: { type: mongoose.Schema.Types.ObjectId, ref: 'payment', default: null },
        rating: { type: Number, required: true, min: 1, max: 5 },
        content: { type: String, required: true },
    },
    {
        timestamps: true,
    },
);

module.exports = mongoose.model('feedback', modelFeedback);

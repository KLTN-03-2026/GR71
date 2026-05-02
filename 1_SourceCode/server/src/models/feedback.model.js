const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const modelFeedback = new Schema(
    {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: 'product', required: true },
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
        rating: { type: Number, required: true },
        content: { type: String, required: true },
    },
    {
        timestamps: true,
    },
);

module.exports = mongoose.model('feedback', modelFeedback);

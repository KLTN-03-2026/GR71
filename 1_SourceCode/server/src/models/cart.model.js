const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },

        email: { type: String },
        phone: { type: String },
        fullName: { type: String },
        address: { type: String },

        items: [
            {
                product: { type: mongoose.Schema.Types.ObjectId, ref: 'product', required: true },

                // Người dùng phải chọn 1 đợt khởi hành cụ thể
                departureScheduleId: { type: mongoose.Schema.Types.ObjectId, required: true },

                // Số lượng
                quantity: {
                    adult: { type: Number, default: 1 },
                    child: { type: Number, default: 0 },
                    baby: { type: Number, default: 0 },
                },

                // Giá snapshot tại thời điểm thêm vào giỏ (tránh thay đổi khi admin chỉnh sửa product)
                priceSnapshot: {
                    adult: { type: Number, default: 0 },
                    child: { type: Number, default: 0 },
                    baby: { type: Number, default: 0 },
                },

                // Tổng tiền của item này (tính nhanh)
                totalItemPrice: { type: Number, default: 0 },
            },
        ],

        // Tổng tiền giỏ hàng
        totalCartPrice: { type: Number, default: 0 },
        nameCounpon: { type: String, default: '' },
    },
    { timestamps: true },
);

module.exports = mongoose.model('cart', cartSchema);

const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
    {
        // Tên tour
        title: { type: String, required: true, trim: true },

        // Điểm đến chính (ví dụ: "Đà Nẵng", "Nha Trang", "Phú Quốc")
        destination: { type: String, required: true, trim: true },

        // Mô tả chi tiết
        description: { type: String, trim: true },

        // Danh mục tour
        category: { type: mongoose.Schema.Types.ObjectId, ref: 'category' },

        // Ảnh
        images: [{ type: String }],

        // Phương tiện di chuyển
        transport: [String],

        // giá tour

        // Các đợt khởi hành
        departureSchedules: [
            {
                departureDate: { type: Date, required: true }, // ngày đi
                returnDate: { type: Date, required: true }, // ngày về

                // Khách sạn
                hotel: {
                    name: String,
                    stars: { type: Number, min: 1, max: 5 },
                },

                // Giá tour cho đợt này
                price: {
                    adult: { type: Number, default: 0 },
                    child: { type: Number, default: 0 },
                    baby: { type: Number, default: 0 },
                },

                // Vé còn lại
                seatsAvailable: { type: Number, default: 0 },
            },
        ],
    },
    {
        timestamps: true,
    },
);

module.exports = mongoose.model('product', productSchema);

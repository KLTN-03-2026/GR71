const Groq = require('groq-sdk');
require('dotenv').config();

const Product = require('../models/product.model');
const Payment = require('../models/payment.model');
const Favourite = require('../models/favourite.model');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

async function getRecommendations(userId) {
    // 1. Lấy lịch sử thanh toán và yêu thích của user
    const [payments, favourites] = await Promise.all([
        Payment.find({
            user: userId,
            paymentStatus: { $in: ['success', 'completed'] },
        }).populate({
            path: 'items.product',
            populate: { path: 'category', select: 'categoryName' },
        }),
        Favourite.find({ userId }).populate({
            path: 'productId',
            populate: { path: 'category', select: 'categoryName' },
        }),
    ]);

    // 2. Tập hợp tín hiệu sở thích từ lịch sử
    const destinationCount = {};
    const categoryCount = {};
    const transportCount = {};
    const bookedProductIds = new Set();
    const prices = [];

    for (const payment of payments) {
        for (const item of payment.items) {
            const tour = item.product;
            if (!tour) continue;
            bookedProductIds.add(tour._id.toString());

            if (tour.destination) {
                destinationCount[tour.destination] = (destinationCount[tour.destination] || 0) + 2;
            }
            const catName = tour.category?.categoryName;
            if (catName) {
                categoryCount[catName] = (categoryCount[catName] || 0) + 2;
            }
            (tour.transport || []).forEach((t) => {
                transportCount[t] = (transportCount[t] || 0) + 1;
            });
            if (item.priceSnapshot?.adult > 0) {
                prices.push(item.priceSnapshot.adult);
            }
        }
    }

    const favouriteProductIds = new Set();
    for (const fav of favourites) {
        const tour = fav.productId;
        if (!tour) continue;
        favouriteProductIds.add(tour._id.toString());

        if (tour.destination) {
            destinationCount[tour.destination] = (destinationCount[tour.destination] || 0) + 1;
        }
        const catName = tour.category?.categoryName;
        if (catName) {
            categoryCount[catName] = (categoryCount[catName] || 0) + 1;
        }
        (tour.transport || []).forEach((t) => {
            transportCount[t] = (transportCount[t] || 0) + 0.5;
        });
        const price = tour.departureSchedules?.[0]?.price?.adult;
        if (price > 0) prices.push(price);
    }

    const hasHistory = bookedProductIds.size > 0 || favouriteProductIds.size > 0;

    // 3. Lấy tất cả tour và scoring
    const allTours = await Product.find({}).populate('category', 'categoryName');

    const now = new Date();
    const avgPrice = prices.length ? prices.reduce((a, b) => a + b, 0) / prices.length : 0;

    const scored = allTours
        .filter((tour) => {
            // Loại bỏ tour đã đặt, đã yêu thích, và tour không còn lịch khởi hành tương lai
            if (bookedProductIds.has(tour._id.toString())) return false;
            if (favouriteProductIds.has(tour._id.toString())) return false;
            const hasUpcoming = tour.departureSchedules?.some(
                (s) => new Date(s.departureDate) > now && s.seatsAvailable > 0,
            );
            return hasUpcoming;
        })
        .map((tour) => {
            let score = 0;

            if (hasHistory) {
                // Điểm đến
                score += (destinationCount[tour.destination] || 0) * 3;

                // Category
                const catName = tour.category?.categoryName;
                if (catName) score += (categoryCount[catName] || 0) * 2;

                // Phương tiện
                (tour.transport || []).forEach((t) => {
                    score += (transportCount[t] || 0) * 1;
                });

                // Khoảng giá tương đồng (±30%)
                const adultPrice = tour.departureSchedules?.[0]?.price?.adult || 0;
                if (avgPrice > 0 && adultPrice > 0) {
                    const diff = Math.abs(adultPrice - avgPrice) / avgPrice;
                    if (diff < 0.3) score += 2;
                    else if (diff < 0.6) score += 1;
                }
            } else {
                // Không có lịch sử → dùng điểm ngẫu nhiên để đa dạng hoá
                score = Math.random() * 10;
            }

            return { tour, score };
        });

    // 4. Sắp xếp theo score, lấy top 8
    scored.sort((a, b) => b.score - a.score);
    const topTours = scored.slice(0, 8).map((s) => s.tour);

    if (topTours.length === 0) {
        return { tours: [], message: null };
    }

    // 5. Tạo message cá nhân hoá bằng Groq (ngắn gọn)
    let message = null;
    if (hasHistory) {
        try {
            const topDestinations = Object.entries(destinationCount)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 3)
                .map(([d]) => d)
                .join(', ');
            const topCategories = Object.entries(categoryCount)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 2)
                .map(([c]) => c)
                .join(', ');

            const prompt = `Bạn là trợ lý tư vấn du lịch. Dựa trên dữ liệu sau, viết 1-2 câu ngắn gọn, thân thiện bằng tiếng Việt để giới thiệu mục "Gợi ý cho bạn" trên trang chủ. Không giải thích thuật toán, chỉ nói về sở thích du lịch.
Dữ liệu: điểm đến yêu thích: ${topDestinations || 'đa dạng'}; thể loại tour ưa thích: ${topCategories || 'đa dạng'}; đã đặt ${bookedProductIds.size} tour, đã lưu ${favouriteProductIds.size} tour yêu thích.
Ví dụ: "Dựa trên những chuyến đi của bạn, chúng tôi nghĩ bạn sẽ thích các tour miền biển này!"`;

            const completion = await groq.chat.completions.create({
                model: 'llama-3.3-70b-versatile',
                messages: [{ role: 'user', content: prompt }],
                temperature: 0.7,
                max_tokens: 120,
            });
            message = completion.choices[0].message.content?.trim() || null;
        } catch {
            // Groq lỗi → dùng message mặc định
        }
    }

    if (!message) {
        message = hasHistory
            ? 'Dựa trên lịch sử của bạn, chúng tôi gợi ý những tour phù hợp nhất!'
            : 'Những tour đang được yêu thích nhất hiện nay!';
    }

    return { tours: topTours, message };
}

module.exports = { getRecommendations };

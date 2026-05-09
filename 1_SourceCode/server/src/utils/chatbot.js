const Groq = require('groq-sdk');
require('dotenv').config();

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const Product = require('../models/product.model');
const Payment = require('../models/payment.model');

// Lấy thông tin đặt tour của 1 sản phẩm
async function getTourBookings(productId) {
    const payments = await Payment.find({
        'items.product': productId,
        paymentStatus: { $in: ['pending', 'success', 'completed'] }, // bỏ failed, cancelled
    });

    let bookings = [];
    payments.forEach((payment) => {
        payment.items.forEach((item) => {
            if (item.product.toString() === productId.toString()) {
                bookings.push({
                    departureScheduleId: item.departureScheduleId,
                    quantity: item.quantity,
                    totalPrice: item.totalItemPrice,
                    bookingDate: payment.createdAt,
                    status: payment.paymentStatus,
                });
            }
        });
    });

    return bookings;
}

// AI tư vấn tour du lịch
async function askTourAssistant(question) {
    try {
        const tours = await Product.find({});
        let tourData = '';

        for (const tour of tours) {
            const bookings = await getTourBookings(tour._id.toString());

            // Tính tổng số chỗ đã đặt cho mỗi lịch trình
            const scheduleBookings = {};
            bookings.forEach((booking) => {
                const scheduleId = booking.departureScheduleId;
                if (!scheduleBookings[scheduleId]) {
                    scheduleBookings[scheduleId] = 0;
                }
                scheduleBookings[scheduleId] +=
                    (booking.quantity.adult || 0) + (booking.quantity.child || 0) + (booking.quantity.baby || 0);
            });

            // Thông tin lịch trình
            let scheduleInfo = '';
            tour.departureSchedules.forEach((schedule, index) => {
                const bookedSeats = scheduleBookings[schedule._id] || 0;
                const availableSeats = (schedule.seatsAvailable || 0) - bookedSeats;
                const hotelInfo = schedule.hotel?.name
                    ? `${schedule.hotel.name} (${schedule.hotel.stars || '?'} sao)`
                    : 'Chưa cập nhật';

                scheduleInfo += `
                Lịch trình ${index + 1}:
                - Ngày đi: ${schedule.departureDate ? new Date(schedule.departureDate).toLocaleDateString('vi-VN') : 'Chưa rõ'}
                - Ngày về: ${schedule.returnDate ? new Date(schedule.returnDate).toLocaleDateString('vi-VN') : 'Chưa rõ'}
                - Khách sạn: ${hotelInfo}
                - Giá: NL ${(schedule.price?.adult || 0).toLocaleString('vi-VN')}đ, TE ${(schedule.price?.child || 0).toLocaleString('vi-VN')}đ, EB ${(schedule.price?.baby || 0).toLocaleString('vi-VN')}đ
                - Chỗ trống: ${availableSeats > 0 ? availableSeats : 'Hết chỗ'}
                `;
            });

            tourData += `
            ========================================
            Tên tour: ${tour.title}
            Điểm đến: ${tour.destination}
            Phương tiện: ${tour.transport?.join(', ') || 'Không rõ'}
            Mô tả: ${
                tour.description ? tour.description.replace(/<[^>]*>/g, '').substring(0, 200) + '...' : 'Không có mô tả'
            }
            
            ${scheduleInfo}
            ========================================\n`;
        }

        const prompt = `
            Bạn là chuyên viên tư vấn tour du lịch chuyên nghiệp và thân thiện. 
            Dưới đây là danh sách các tour hiện có:

            ${tourData}

            Khách hỏi: "${question}"

            Nhiệm vụ của bạn:
            - Tư vấn tour phù hợp dựa trên nhu cầu khách hàng (điểm đến, thời gian, ngân sách, số người)
            - Đề xuất tour có chỗ trống và giá cả hợp lý
            - Giải thích rõ về lịch trình, khách sạn, phương tiện di chuyển
            - Tư vấn thời điểm đi tour tốt nhất
            - Gợi ý các dịch vụ bổ sung nếu cần
            - Trả lời tự nhiên, nhiệt tình, chuyên nghiệp
            - Nếu không có tour phù hợp, gợi ý tour tương tự hoặc hỏi thêm thông tin

            Lưu ý:
            - NL = Người lớn, TE = Trẻ em, EB = Em bé
            - Ưu tiên tour có chỗ trống
            - Đưa ra lời khuyên thực tế về thời tiết, mùa du lịch
            `;

        const completion = await groq.chat.completions.create({
            model: 'llama-3.3-70b-versatile',
            messages: [
                {
                    role: 'system',
                    content:
                        'Bạn là chuyên viên tư vấn tour du lịch chuyên nghiệp, thân thiện, luôn đặt lợi ích khách hàng lên hàng đầu.',
                },
                { role: 'user', content: prompt },
            ],
            temperature: 0.7,
            max_tokens: 1000,
        });

        return completion.choices[0].message.content;
    } catch (error) {
        console.error('[ChatBot Error]', error?.message || error);
        if (error?.status === 401 || error?.error?.type === 'invalid_api_key') {
            return 'Xin lỗi, hệ thống AI đang gặp sự cố xác thực. Vui lòng liên hệ admin để kiểm tra cấu hình.';
        }
        if (error?.status === 429) {
            return 'Xin lỗi, AI đang quá tải. Vui lòng thử lại sau vài giây.';
        }
        return 'Xin lỗi, có lỗi xảy ra khi tư vấn tour. Vui lòng thử lại hoặc liên hệ hotline để được hỗ trợ tốt nhất.';
    }
}

module.exports = { askTourAssistant };

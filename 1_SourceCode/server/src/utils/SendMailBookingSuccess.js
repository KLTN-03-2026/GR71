const { google } = require('googleapis');
const nodemailer = require('nodemailer');
require('dotenv').config();

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;
const REFRESH_TOKEN = process.env.REFRESH_TOKEN;

const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

const SendMailBookingSuccess = async (bookingData) => {
    try {
        const accessToken = await oAuth2Client.getAccessToken();
        const transport = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                type: 'OAuth2',
                user: process.env.EMAIL_USER,
                clientId: CLIENT_ID,
                clientSecret: CLIENT_SECRET,
                refreshToken: REFRESH_TOKEN,
                accessToken: accessToken,
            },
        });

        // Tạo danh sách tour items
        const tourItemsHtml = bookingData.items
            .map(
                (item, index) => `
            <div style="background-color: #f8f9fa; padding: 15px; margin-bottom: 15px; border-radius: 8px; border-left: 4px solid #6c5ce7;">
                <h4 style="margin: 0 0 10px 0; color: #2d3436;">Tour ${index + 1}: ${
                    item.tourName || 'Tour du lịch'
                }</h4>
                <p style="margin: 5px 0; color: #636e72;">
                    <strong>Ngày khởi hành:</strong> ${item.departureDate || 'Đang cập nhật'}
                </p>
                <p style="margin: 5px 0; color: #636e72;">
                    <strong>Số lượng:</strong> 
                    ${item.quantity.adult > 0 ? `${item.quantity.adult} người lớn` : ''}
                    ${item.quantity.child > 0 ? `, ${item.quantity.child} trẻ em` : ''}
                    ${item.quantity.baby > 0 ? `, ${item.quantity.baby} em bé` : ''}
                </p>
                <p style="margin: 5px 0; color: #636e72;">
                    <strong>Giá:</strong>
                    ${
                        item.quantity.adult > 0
                            ? `${item.priceSnapshot.adult.toLocaleString('vi-VN')}₫ x ${item.quantity.adult}`
                            : ''
                    }
                    ${
                        item.quantity.child > 0
                            ? `, ${item.priceSnapshot.child.toLocaleString('vi-VN')}₫ x ${item.quantity.child}`
                            : ''
                    }
                    ${
                        item.quantity.baby > 0
                            ? `, ${item.priceSnapshot.baby.toLocaleString('vi-VN')}₫ x ${item.quantity.baby}`
                            : ''
                    }
                </p>
                <p style="margin: 10px 0 0 0; font-weight: bold; color: #6c5ce7; font-size: 16px;">
                    Thành tiền: ${item.totalItemPrice.toLocaleString('vi-VN')}₫
                </p>
            </div>
        `,
            )
            .join('');

        const info = await transport.sendMail({
            from: `"Moho Travel" <${process.env.EMAIL_USER}>`,
            to: bookingData.email,
            subject: 'Xác nhận đặt tour du lịch thành công',
            text: `Cảm ơn bạn đã đặt tour. Mã đơn hàng: ${
                bookingData._id
            }. Tổng tiền: ${bookingData.totalCartPrice.toLocaleString('vi-VN')}₫`,
            html: `
            <!DOCTYPE html>
            <html lang="vi">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <style>
                    body {
                        font-family: 'Roboto', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                        background-color: #f2f4f8;
                        margin: 0;
                        padding: 0;
                        color: #2d3436;
                    }
                    .container {
                        max-width: 650px;
                        margin: 30px auto;
                        background-color: #ffffff;
                        border-radius: 12px;
                        overflow: hidden;
                        box-shadow: 0 8px 16px rgba(0,0,0,0.1);
                    }
                    .header {
                        background: linear-gradient(135deg, #6c5ce7, #a29bfe);
                        padding: 35px 30px;
                        color: #ffffff;
                        text-align: center;
                    }
                    .header h2 {
                        margin: 0 0 10px 0;
                        font-size: 26px;
                        font-weight: 600;
                    }
                    .header p {
                        margin: 0;
                        font-size: 14px;
                        opacity: 0.95;
                    }
                    .success-icon {
                        width: 60px;
                        height: 60px;
                        background-color: #00b894;
                        border-radius: 50%;
                        margin: 0 auto 15px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-size: 32px;
                    }
                    .content {
                        padding: 30px;
                    }
                    .greeting {
                        font-size: 18px;
                        font-weight: 500;
                        margin-bottom: 15px;
                        color: #2d3436;
                    }
                    .message {
                        font-size: 15px;
                        margin-bottom: 20px;
                        line-height: 1.6;
                        color: #636e72;
                    }
                    .info-box {
                        background-color: #f8f9fa;
                        border-radius: 8px;
                        padding: 20px;
                        margin: 20px 0;
                    }
                    .info-row {
                        display: flex;
                        justify-content: space-between;
                        padding: 8px 0;
                        border-bottom: 1px solid #e1e4e8;
                    }
                    .info-row:last-child {
                        border-bottom: none;
                    }
                    .info-label {
                        font-weight: 500;
                        color: #636e72;
                    }
                    .info-value {
                        color: #2d3436;
                        font-weight: 500;
                    }
                    .section-title {
                        font-size: 18px;
                        font-weight: 600;
                        color: #2d3436;
                        margin: 25px 0 15px 0;
                        padding-bottom: 10px;
                        border-bottom: 2px solid #6c5ce7;
                    }
                    .total-box {
                        background: linear-gradient(135deg, #6c5ce7, #a29bfe);
                        color: white;
                        padding: 20px;
                        border-radius: 10px;
                        text-align: center;
                        margin: 20px 0;
                    }
                    .total-box .label {
                        font-size: 14px;
                        margin-bottom: 8px;
                        opacity: 0.9;
                    }
                    .total-box .amount {
                        font-size: 32px;
                        font-weight: bold;
                        letter-spacing: 1px;
                    }
                    .note {
                        background-color: #fff3cd;
                        border-left: 4px solid #ffc107;
                        padding: 15px;
                        border-radius: 6px;
                        margin: 20px 0;
                        font-size: 14px;
                        color: #856404;
                    }
                    .footer {
                        text-align: center;
                        font-size: 14px;
                        padding: 25px;
                        background-color: #f1f2f6;
                        color: #636e72;
                        line-height: 1.6;
                    }
                    .footer strong {
                        color: #6c5ce7;
                        font-size: 16px;
                    }
                    .contact-info {
                        margin-top: 15px;
                        font-size: 13px;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h2>Đặt Tour Thành Công!</h2>
                        <p>Cảm ơn bạn đã tin tưởng và lựa chọn dịch vụ của chúng tôi</p>
                    </div>
                    
                    <div class="content">
                        <div class="greeting">Xin chào ${bookingData.fullName},</div>
                        
                        <div class="message">
                            Chúng tôi đã nhận được đơn đặt tour du lịch của bạn. Dưới đây là thông tin chi tiết về đơn hàng:
                        </div>

                        <div class="info-box">
                            <div class="info-row">
                                <span class="info-label">Mã đơn hàng:</span>
                                <span class="info-value">${bookingData._id || 'Đang cập nhật'}</span>
                            </div>
                            <div class="info-row">
                                <span class="info-label">Họ và tên:</span>
                                <span class="info-value">${bookingData.fullName}</span>
                            </div>
                            <div class="info-row">
                                <span class="info-label">Số điện thoại:</span>
                                <span class="info-value">${bookingData.phone}</span>
                            </div>
                            <div class="info-row">
                                <span class="info-label">Email:</span>
                                <span class="info-value">${bookingData.email}</span>
                            </div>
                            <div class="info-row">
                                <span class="info-label">Địa chỉ:</span>
                                <span class="info-value">${bookingData.address}</span>
                            </div>
                            <div class="info-row">
                                <span class="info-label">Phương thức thanh toán:</span>
                                <span class="info-value">${
                                    bookingData.paymentMethod === 'momo' ? 'MoMo' : 'VNPay'
                                }</span>
                            </div>
                            ${
                                bookingData.nameCounpon
                                    ? `
                            <div class="info-row">
                                <span class="info-label">Mã giảm giá:</span>
                                <span class="info-value">${bookingData.nameCounpon}</span>
                            </div>
                            `
                                    : ''
                            }
                        </div>

                        <h3 class="section-title">Chi tiết tour đã đặt</h3>
                        ${tourItemsHtml}

                        <div class="total-box">
                            <div class="label">TỔNG THANH TOÁN</div>
                            <div class="amount">${bookingData.totalCartPrice.toLocaleString('vi-VN')}₫</div>
                        </div>

                        <div class="note">
                            <strong>📌 Lưu ý quan trọng:</strong>
                            <ul style="margin: 10px 0 0 0; padding-left: 20px;">
                                <li>Vui lòng giữ lại email này để làm chứng từ khi tham gia tour</li>
                                <li>Đội ngũ của chúng tôi sẽ liên hệ với bạn trong vòng 24h để xác nhận lại thông tin</li>
                                <li>Nếu cần hỗ trợ, vui lòng liên hệ hotline hoặc trả lời email này</li>
                            </ul>
                        </div>

                        <div class="message">
                            Chúng tôi rất mong được phục vụ bạn và đồng hành cùng bạn trong hành trình khám phá những điểm đến tuyệt vời!
                        </div>
                    </div>
                    
                    <div class="footer">
                        Trân trọng,<br/>
                        <strong>Moho Travel</strong>
                        <div class="contact-info">
                            📞 Hotline: 1900 xxxx | 📧 Email: support@moho.com<br/>
                            🌐 Website: www.moho.com | 📍 Địa chỉ: Hà Nội, Việt Nam
                        </div>
                    </div>
                </div>
            </body>
            </html>
            `,
        });

        console.log('Booking success email sent:', info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.log('Error sending booking success email:', error);
        return { success: false, error: error.message };
    }
};

module.exports = SendMailBookingSuccess;

const Cart = require('../models/cart.model');
const modelCoupon = require('../models/counpon.model');
const Payment = require('../models/payment.model');
const Product = require('../models/product.model');

const SendMailBookingSuccess = require('../utils/SendMailBookingSuccess');

const { BadRequestError } = require('../core/error.response');

const { VNPay, ignoreLogger, ProductCode, VnpLocale, dateFormat } = require('vnpay');

const crypto = require('crypto');
const https = require('https');

function generatePayID() {
    // Tạo ID thanh toán bao gồm cả giây để tránh trùng lặp
    const now = new Date();
    const timestamp = now.getTime();
    const seconds = now.getSeconds().toString().padStart(2, '0');
    const milliseconds = now.getMilliseconds().toString().padStart(3, '0');
    return `PAY${timestamp}${seconds}${milliseconds}`;
}

async function calculateTotalPrice(cart, nameCoupon) {
    if (nameCoupon) {
        const coupon = await modelCoupon.findOne({ nameCoupon });

        if (!coupon) {
            throw new BadRequestError('Mã giảm giá không hợp lệ');
        }

        const now = new Date();
        if (coupon.startDate > now || coupon.endDate < now) {
            throw new BadRequestError('Mã giảm giá đã hết hạn');
        }

        if (cart.totalCartPrice < coupon.minPrice) {
            throw new BadRequestError(`Đơn hàng phải tối thiểu ${coupon.minPrice} để áp dụng mã`);
        }

        const discount = Number(coupon.discount);
        const total = Number(cart.totalCartPrice);

        return Math.round(total - (total * discount) / 100);
    }
    return Number(cart.totalCartPrice);
}

class PaymentService {
    async createPayment(typePayment, userId) {
        const findCart = await Cart.findOne({ user: userId });
        if (typePayment === 'momo') {
            return new Promise(async (resolve, reject) => {
                const accessKey = 'F8BBA842ECF85';
                const secretKey = 'K951B6PE1waDMi640xX08PD3vg6EkVlz';
                const partnerCode = 'MOMO';
                const orderId = partnerCode + new Date().getTime();
                const requestId = orderId;
                const orderInfo = `Thanh toan don hang ${findCart.user}`;
                const redirectUrl = 'http://localhost:3000/api/payment/momo';
                const ipnUrl = 'http://localhost:3000/api/payment/momo';
                const requestType = 'payWithMethod';
                const amount = await calculateTotalPrice(findCart, findCart.nameCounpon);
                const extraData = '';

                const rawSignature =
                    'accessKey=' +
                    accessKey +
                    '&amount=' +
                    amount +
                    '&extraData=' +
                    extraData +
                    '&ipnUrl=' +
                    ipnUrl +
                    '&orderId=' +
                    orderId +
                    '&orderInfo=' +
                    orderInfo +
                    '&partnerCode=' +
                    partnerCode +
                    '&redirectUrl=' +
                    redirectUrl +
                    '&requestId=' +
                    requestId +
                    '&requestType=' +
                    requestType;

                const signature = crypto.createHmac('sha256', secretKey).update(rawSignature).digest('hex');

                const requestBody = JSON.stringify({
                    partnerCode,
                    partnerName: 'Test',
                    storeId: 'MomoTestStore',
                    requestId,
                    amount,
                    orderId,
                    orderInfo,
                    redirectUrl,
                    ipnUrl,
                    lang: 'vi',
                    requestType,
                    autoCapture: true,
                    extraData,
                    orderGroupId: '',
                    signature,
                });

                const options = {
                    hostname: 'test-payment.momo.vn',
                    port: 443,
                    path: '/v2/gateway/api/create',
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Content-Length': Buffer.byteLength(requestBody),
                    },
                };

                const req = https.request(options, (res) => {
                    let data = '';
                    res.on('data', (chunk) => {
                        data += chunk;
                    });
                    res.on('end', () => {
                        try {
                            resolve(JSON.parse(data));
                        } catch (err) {
                            reject(err);
                        }
                    });
                });

                req.on('error', (e) => reject(e));
                req.write(requestBody);
                req.end();
            });
        } else if (typePayment === 'vnpay') {
            const vnpay = new VNPay({
                tmnCode: 'DH2F13SW',
                secureSecret: '7VJPG70RGPOWFO47VSBT29WPDYND0EJG',
                vnpayHost: 'https://sandbox.vnpayment.vn',
                testMode: true, // tùy chọn
                hashAlgorithm: 'SHA512', // tùy chọn
                loggerFn: ignoreLogger, // tùy chọn
            });
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            const vnpayResponse = await vnpay.buildPaymentUrl({
                vnp_Amount: await calculateTotalPrice(findCart, findCart.nameCounpon), //
                vnp_IpAddr: '127.0.0.1', //
                vnp_TxnRef: `${findCart.user} + ${generatePayID()}`, // Sử dụng paymentId thay vì singlePaymentId
                vnp_OrderInfo: `Thanh toan don hang ${findCart.user}`,
                vnp_OrderType: ProductCode.Other,
                vnp_ReturnUrl: `http://localhost:3000/api/payment/vnpay`, //
                vnp_Locale: VnpLocale.VN, // 'vn' hoặc 'en'
                vnp_CreateDate: dateFormat(new Date()), // tùy chọn, mặc định là hiện tại
                vnp_ExpireDate: dateFormat(tomorrow), // tùy chọn
            });

            return vnpayResponse;
        }
    }

    async momoCallback(userId) {
        const findCart = await Cart.findOne({ user: userId });
        if (!findCart) {
            throw new BadRequestError('Không tìm thấy giỏ hàng');
        }

        const payment = new Payment({
            user: userId,
            email: findCart.email,
            phone: findCart.phone,
            fullName: findCart.fullName,
            address: findCart.address,
            items: findCart.items,
            totalCartPrice: findCart.totalCartPrice,
            nameCounpon: findCart.nameCounpon,
            paymentMethod: 'momo',
            paymentStatus: 'pending',
        });

        await payment.save();

        // Trừ số lượng vé còn lại (seatsAvailable) cho mỗi item
        for (const item of findCart.items) {
            const totalSeats = (item.quantity.adult || 0) + (item.quantity.child || 0) + (item.quantity.baby || 0);

            await Product.findOneAndUpdate(
                {
                    _id: item.product,
                    'departureSchedules._id': item.departureScheduleId,
                },
                {
                    $inc: { 'departureSchedules.$.seatsAvailable': -totalSeats },
                },
            );
        }

        await SendMailBookingSuccess(payment);
        await Cart.findByIdAndDelete(findCart._id);
        await modelCoupon.findOneAndUpdate({ nameCoupon: findCart.nameCounpon }, { $inc: { quantity: -1 } });

        return payment;
    }

    async getPaymentById(userId, id) {
        const payment = await Payment.findOne({ user: userId, _id: id })
            .sort({ createdAt: -1 })
            .populate('items.product');
        if (!payment) {
            throw new BadRequestError('Không tìm thấy thanh toán');
        }

        return payment;
    }

    async vnpayCallback(userId) {
        const findCart = await Cart.findOne({ user: userId });
        if (!findCart) {
            throw new BadRequestError('Không tìm thấy giỏ hàng');
        }

        const payment = new Payment({
            user: userId,
            email: findCart.email,
            phone: findCart.phone,
            fullName: findCart.fullName,
            address: findCart.address,
            items: findCart.items,
            totalCartPrice: findCart.totalCartPrice,
            nameCounpon: findCart.nameCounpon,
            paymentMethod: 'vnpay',
            paymentStatus: 'pending',
        });

        await payment.save();

        // Trừ số lượng vé còn lại (seatsAvailable) cho mỗi item
        for (const item of findCart.items) {
            const totalSeats = (item.quantity.adult || 0) + (item.quantity.child || 0) + (item.quantity.baby || 0);

            await Product.findOneAndUpdate(
                {
                    _id: item.product,
                    'departureSchedules._id': item.departureScheduleId,
                },
                {
                    $inc: { 'departureSchedules.$.seatsAvailable': -totalSeats },
                },
            );
        }

        await SendMailBookingSuccess(payment);
        await Cart.findByIdAndDelete(findCart._id);
        await modelCoupon.findOneAndUpdate({ nameCoupon: findCart.nameCounpon }, { $inc: { quantity: -1 } });
        return payment;
    }

    async getPaymentByUserId(userId) {
        const payments = await Payment.find({ user: userId }).sort({ createdAt: -1 }).populate('items.product');
        return payments;
    }

    async getPaymentByAdmin() {
        const payments = await Payment.find().sort({ createdAt: -1 }).populate('items.product');
        return payments;
    }

    async updatePaymentStatus(id, status) {
        const payment = await Payment.findByIdAndUpdate(id, { paymentStatus: status }, { new: true });
        return payment;
    }
}

module.exports = new PaymentService();

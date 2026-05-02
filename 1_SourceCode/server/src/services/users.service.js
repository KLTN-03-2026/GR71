const modelUser = require('../models/users.model');
const modelApiKey = require('../models/apiKey.model');
const modelOtp = require('../models/otp.model');
const modelMessageChatbot = require('../models/messageChatbot.model');
// const { askHotelAssistant } = require('../utils/chatbot');

const { createToken, createRefreshToken, createApiKey, verifyToken } = require('../utils/jwt');
const { jwtDecode } = require('jwt-decode');
const jwt = require('jsonwebtoken');

const { ConflictRequestError, BadRequestError } = require('../core/error.response');

const otpGenerator = require('otp-generator');
const bcrypt = require('bcrypt');
const CryptoJS = require('crypto-js');
const SendMailForgotPassword = require('../utils/sendMailForgotPassword');
const { askTourAssistant } = require('../utils/chatbot');

class UserService {
    async createUser(data) {
        const { fullName, email, password } = data;
        const findUser = await modelUser.findOne({ email });
        if (findUser) {
            throw new ConflictRequestError('Email đã tồn tại');
        }

        const saltRounds = 10;
        const salt = bcrypt.genSaltSync(saltRounds);
        const passwordHash = bcrypt.hashSync(password, salt);

        // Tạo user mới
        const newUser = await modelUser.create({
            fullName,
            email,
            password: passwordHash,
            typeLogin: 'email',
        });

        // Tạo API key và token
        await createApiKey(newUser._id);
        const token = await createToken({ id: newUser._id });
        const refreshToken = await createRefreshToken({ id: newUser._id });

        return { token, refreshToken };
    }

    async authUser(id) {
        const findUser = await modelUser.findById(id);
        if (!findUser) {
            throw new BadRequestError('User không tồn tại');
        }
        const userString = JSON.stringify(findUser);
        const auth = CryptoJS.AES.encrypt(userString, process.env.SECRET_CRYPTO).toString();
        return auth;
    }

    async login(data) {
        const { email, password } = data;
        const user = await modelUser.findOne({ email });
        if (!user) {
            throw new BadRequestError('Tài khoản hoặc mật khẩu không chính xác');
        }
        if (user.typeLogin === 'google') {
            throw new BadRequestError('Tài khoản đăng nhập bằng google');
        }

        const checkPassword = bcrypt.compareSync(password, user.password);
        if (!checkPassword) {
            throw new BadRequestError('Tài khoản hoặc mật khẩu không chính xác');
        }
        await createApiKey(user._id);
        const token = await createToken({ id: user._id });
        const refreshToken = await createRefreshToken({ id: user._id });
        return { token, refreshToken };
    }

    async logout(id) {
        await modelApiKey.deleteMany({ userId: id });
        return { status: 200 };
    }

    async refreshToken(refreshToken) {
        const decoded = await verifyToken(refreshToken);

        const user = await modelUser.findOne({ _id: decoded.id });

        const token = await createToken({ id: user._id });
        return { token };
    }

    async getAllUser() {
        const data = await modelUser.find();
        return data;
    }

    async updateUserAdmin(id, data) {
        const { fullName, email, phone, address, isAdmin, typeLogin } = data;
        const user = await modelUser.findOne({ _id: id });
        if (!user) {
            throw new BadRequestError('Tài khoản không tồn tại');
        }
        user.fullName = fullName;
        user.email = email;
        user.phone = phone;
        user.address = address;
        user.isAdmin = isAdmin;
        user.typeLogin = typeLogin;
        await user.save();
        return user;
    }

    async deleteUser(id) {
        const user = await modelUser.findOne({ _id: id });
        if (!user) {
            throw new BadRequestError('Tài khoản không tồn tại');
        }
        await user.deleteOne();
        return user;
    }

    async changePassword(id, data) {
        const { currentPassword, newPassword } = data;
        const user = await modelUser.findOne({ _id: id });
        if (!user) {
            throw new BadRequestError('Người dùng không tồn tại');
        }
        const isPasswordValid = bcrypt.compareSync(currentPassword, user.password);
        if (!isPasswordValid) {
            throw new BadRequestError('Mật khẩu hiện tại không chính xác');
        }
        const saltRounds = 10;
        const salt = bcrypt.genSaltSync(saltRounds);
        const passwordHash = bcrypt.hashSync(newPassword, salt);
        user.password = passwordHash;
        await user.save();
        return user;
    }

    async updateUser(id, data) {
        const { fullName, address, phone, birthDay, email } = data;
        const user = await modelUser.findOne({ _id: id });
        if (!user) {
            throw new BadRequestError('Người dùng không tồn tại');
        }
        user.fullName = fullName;
        user.address = address;
        user.phone = phone;
        user.birthDay = birthDay;
        user.email = email;
        await user.save();
        return user;
    }

    async uploadAvatar(id, filename) {
        const user = await modelUser.findOne({ _id: id });
        if (!user) {
            throw new BadRequestError('Người dùng không tồn tại');
        }
        user.avatar = filename;
        await user.save();
        return user;
    }

    async loginGoogle(credential) {
        const dataToken = jwtDecode(credential);
        const user = await modelUser.findOne({ email: dataToken.email });

        if (user) {
            await createApiKey(user._id);
            const token = await createToken({ id: user._id });
            const refreshToken = await createRefreshToken({ id: user._id });
            return { token, refreshToken };
        } else {
            const newUser = await modelUser.create({
                email: dataToken.email,
                typeLogin: 'google',
                fullName: dataToken.name,
            });
            await createApiKey(newUser._id);
            const token = await createToken({ id: newUser._id });
            const refreshToken = await createRefreshToken({ id: newUser._id });
            return { token, refreshToken };
        }
    }

    async forgotPassword(email) {
        const user = await modelUser.findOne({ email });
        if (!user) {
            throw new BadRequestError('Tài khoản không tồn tại');
        }

        const token = jwt.sign({ id: user._id }, process.env.SECRET_CRYPTO, { expiresIn: '5m' });

        const otp = otpGenerator.generate(6, {
            digits: true,
            lowerCaseAlphabets: false,
            upperCaseAlphabets: false,
            specialChars: false,
        });

        const saltRounds = 10;

        const otpHash = bcrypt.hashSync(otp, saltRounds);

        await modelOtp.create({ email: user.email, otp: otpHash });

        await SendMailForgotPassword(user.email, otp);

        return { token, otp };
    }

    async resetPassword(token, otpUser, newPassword) {
        const decoded = jwt.verify(token, process.env.SECRET_CRYPTO);
        const user = await modelUser.findOne({ _id: decoded.id });

        if (!user) {
            throw new BadRequestError('Tài khoản không tồn tại');
        }
        const findOtp = await modelOtp.findOne({ email: user.email }).sort({ createdAt: -1 });

        if (!findOtp) {
            throw new BadRequestError('Mã OTP không hợp lệ');
        }

        const checkOtp = bcrypt.compareSync(otpUser, findOtp.otp);
        if (!checkOtp) {
            throw new BadRequestError('Mã OTP không hợp lệ');
        }
        const saltRounds = 10;
        const salt = bcrypt.genSaltSync(saltRounds);
        const passwordHash = bcrypt.hashSync(newPassword, salt);
        user.password = passwordHash;
        await user.save();
        return user;
    }

    async chatbot(question, userId) {
        const response = await askTourAssistant(question);

        await modelMessageChatbot.create({
            userId: userId,
            sender: 'user',
            content: question,
        });

        await modelMessageChatbot.create({
            userId: userId,
            sender: 'bot',
            content: response,
        });

        return response;
    }

    async getMessageChatbot(userId) {
        const messageChatbot = await modelMessageChatbot.find({ userId });
        return messageChatbot;
    }

    async getDashbroad(startDate, endDate) {
        try {
            const User = require('../models/users.model');
            const Product = require('../models/product.model');
            const Payment = require('../models/payment.model');
            const Feedback = require('../models/feedback.model');
            const Blog = require('../models/blog.model');
            const Category = require('../models/category.model');
            const Favourite = require('../models/favourite.model');
            const Conversation = require('../models/conversation.model');

            // Tạo filter cho date range
            const dateFilter = {};
            if (startDate && endDate) {
                dateFilter.createdAt = {
                    $gte: new Date(startDate),
                    $lte: new Date(endDate),
                };
            }

            // Thống kê tổng quan với date filter
            const totalUsers = await User.countDocuments(dateFilter);
            const totalProducts = await Product.countDocuments(dateFilter);
            const totalOrders = await Payment.countDocuments(dateFilter);

            const revenueMatch = { paymentStatus: { $in: ['success', 'completed'] } };
            if (Object.keys(dateFilter).length > 0) {
                revenueMatch.createdAt = dateFilter.createdAt;
            }

            const totalRevenue = await Payment.aggregate([
                { $match: revenueMatch },
                { $group: { _id: null, total: { $sum: '$totalCartPrice' } } },
            ]);
            const totalFeedback = await Feedback.countDocuments(dateFilter);
            const totalBlogs = await Blog.countDocuments(dateFilter);
            const totalCategories = await Category.countDocuments(dateFilter);

            // Thống kê doanh thu theo tháng (6 tháng gần nhất)
            const revenueMatchMonth = { paymentStatus: { $in: ['success', 'completed'] } };
            if (Object.keys(dateFilter).length > 0) {
                revenueMatchMonth.createdAt = dateFilter.createdAt;
            }

            const revenueByMonth = await Payment.aggregate([
                { $match: revenueMatchMonth },
                {
                    $group: {
                        _id: {
                            year: { $year: '$createdAt' },
                            month: { $month: '$createdAt' },
                        },
                        revenue: { $sum: '$totalCartPrice' },
                        orders: { $sum: 1 },
                    },
                },
                { $sort: { '_id.year': 1, '_id.month': 1 } },
                { $limit: 6 },
            ]);

            // Thống kê đơn hàng theo trạng thái
            const ordersByStatus = await Payment.aggregate([
                {
                    $group: {
                        _id: '$paymentStatus',
                        count: { $sum: 1 },
                    },
                },
            ]);

            // Thống kê tour phổ biến nhất
            const popularTours = await Payment.aggregate([
                { $unwind: '$items' },
                {
                    $group: {
                        _id: '$items.product',
                        bookings: { $sum: 1 },
                        revenue: { $sum: '$items.totalItemPrice' },
                    },
                },
                {
                    $lookup: {
                        from: 'products',
                        localField: '_id',
                        foreignField: '_id',
                        as: 'product',
                    },
                },
                { $unwind: '$product' },
                { $sort: { bookings: -1 } },
                { $limit: 5 },
            ]);

            // Thống kê đánh giá theo sao
            const feedbackByRating = await Feedback.aggregate([
                {
                    $group: {
                        _id: '$rating',
                        count: { $sum: 1 },
                    },
                },
                { $sort: { _id: -1 } },
            ]);

            // Thống kê người dùng mới theo tháng
            const newUsersByMonth = await User.aggregate([
                {
                    $group: {
                        _id: {
                            year: { $year: '$createdAt' },
                            month: { $month: '$createdAt' },
                        },
                        count: { $sum: 1 },
                    },
                },
                { $sort: { '_id.year': 1, '_id.month': 1 } },
                { $limit: 6 },
            ]);

            // Thống kê điểm đến phổ biến
            const popularDestinations = await Product.aggregate([
                {
                    $group: {
                        _id: '$destination',
                        tourCount: { $sum: 1 },
                    },
                },
                { $sort: { tourCount: -1 } },
                { $limit: 5 },
            ]);

            // Thống kê phương tiện di chuyển
            const transportStats = await Product.aggregate([
                { $unwind: '$transport' },
                {
                    $group: {
                        _id: '$transport',
                        count: { $sum: 1 },
                    },
                },
                { $sort: { count: -1 } },
            ]);

            // Thống kê chat/conversation
            const totalConversations = await Conversation.countDocuments();
            const activeConversations = await Conversation.countDocuments({
                lengthIsRead: { $gt: 0 },
            });

            return {
                overview: {
                    totalUsers,
                    totalProducts,
                    totalOrders,
                    totalRevenue: totalRevenue[0]?.total || 0,
                    totalFeedback,
                    totalBlogs,
                    totalCategories,
                    totalConversations,
                    activeConversations,
                },
                charts: {
                    revenueByMonth: revenueByMonth.map((item) => ({
                        month: `${item._id.month}/${item._id.year}`,
                        revenue: item.revenue,
                        orders: item.orders,
                    })),
                    ordersByStatus: ordersByStatus.map((item) => ({
                        status: item._id,
                        count: item.count,
                    })),
                    popularTours: popularTours.map((item) => ({
                        name: item.product.title,
                        destination: item.product.destination,
                        bookings: item.bookings,
                        revenue: item.revenue,
                    })),
                    feedbackByRating: feedbackByRating.map((item) => ({
                        rating: item._id,
                        count: item.count,
                    })),
                    newUsersByMonth: newUsersByMonth.map((item) => ({
                        month: `${item._id.month}/${item._id.year}`,
                        count: item.count,
                    })),
                    popularDestinations: popularDestinations.map((item) => ({
                        destination: item._id,
                        tourCount: item.tourCount,
                    })),
                    transportStats: transportStats.map((item) => ({
                        transport: item._id,
                        count: item.count,
                    })),
                },
            };
        } catch (error) {
            console.error('Error in getDashbroad:', error);
            throw error;
        }
    }
}

module.exports = new UserService();

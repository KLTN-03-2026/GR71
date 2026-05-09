const userRoutes = require('./users.routes');
const categoryRoutes = require('./category.routes');
const productRoutes = require('./product.routes');
const cartRoutes = require('./cart.routes');
const couponRoutes = require('./counpon.routes');
const paymentRoutes = require('./payment.routes');
const messageRoutes = require('./message.routes');
const conversationRoutes = require('./conversation.routes');
const blogsRoutes = require('../routes/blog.routes');
const contactRoutes = require('../routes/contact.routes');
const flashSaleRoutes = require('../routes/flashSale.routes');
const feedbackRoutes = require('../routes/feedback.routes');
const favouriteRoutes = require('../routes/favourite.routes');

function routes(app) {
    app.use('/api/users', userRoutes);
    app.use('/api/category', categoryRoutes);
    app.use('/api/tour', productRoutes);
    app.use('/api/cart', cartRoutes);
    app.use('/api/coupon', couponRoutes);
    app.use('/api/payment', paymentRoutes);
    app.use('/api/message', messageRoutes);
    app.use('/api/conversation', conversationRoutes);
    app.use('/api/blog', blogsRoutes);
    app.use('/api/contact', contactRoutes);
    app.use('/api/flashSale', flashSaleRoutes);
    app.use('/api/feedback', feedbackRoutes);
    app.use('/api/favourite', favouriteRoutes);
}

module.exports = routes;

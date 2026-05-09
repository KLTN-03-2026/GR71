const Cart = require('../models/cart.model');
const Product = require('../models/product.model');
const Coupon = require('../models/counpon.model');
const FlashSale = require('../models/flashSale.model');

const { BadRequestError } = require('../core/error.response');
const { OK, CREATED } = require('../core/success.response');

class CartService {
    async createCart(userId, departureScheduleId, quantity, productId) {
        const product = await Product.findById(productId);
        if (!product) throw new BadRequestError('Tour không tồn tại');

        const schedule = product.departureSchedules.id(departureScheduleId);
        if (!schedule) throw new BadRequestError('Đợt khởi hành không tồn tại');

        const flashSale = await FlashSale.findOne({ productId });

        // Tính giá
        const priceSnapshot = {
            adult: schedule.price.adult,
            child: schedule.price.child,
            baby: schedule.price.baby,
        };
        let totalItemPrice =
            quantity.adult * priceSnapshot.adult +
            quantity.child * priceSnapshot.child +
            quantity.baby * priceSnapshot.baby;

        if (flashSale) {
            totalItemPrice = totalItemPrice * (1 - flashSale.discount / 100);
        }

        // Tìm giỏ hàng user
        let cart = await Cart.findOne({ user: userId });
        if (!cart) {
            cart = new Cart({ user: userId, items: [], totalCartPrice: 0 });
        }

        // Kiểm tra xem item đã tồn tại chưa
        const existingItem = cart.items.find(
            (item) =>
                item.product.toString() === productId && item.departureScheduleId.toString() === departureScheduleId,
        );

        if (existingItem) {
            // Nếu đã có thì cộng dồn số lượng
            existingItem.quantity.adult += quantity.adult;
            existingItem.quantity.child += quantity.child;
            existingItem.quantity.baby += quantity.baby;
            existingItem.totalItemPrice += totalItemPrice;
        } else {
            // Nếu chưa có thì thêm mới
            cart.items.push({
                product: productId,
                departureScheduleId,
                quantity,
                priceSnapshot,
                totalItemPrice,
            });
        }

        // Cập nhật tổng giỏ
        cart.totalCartPrice = cart.items.reduce((sum, i) => sum + i.totalItemPrice, 0);

        await cart.save();
        return cart;
    }

    async applyCoupon(userId, nameCoupon) {
        const cart = await Cart.findOne({ user: userId });
        if (!cart) throw new BadRequestError('Giỏ hàng không tồn tại');

        if (cart.coupon) throw new BadRequestError('Mã giảm giá đã được áp dụng');

        const coupon = await Coupon.findOne({ nameCoupon });
        if (!coupon) throw new BadRequestError('Mã giảm giá không tồn tại');

        // Kiểm tra ngày hợp lệ
        const now = new Date();
        if (now < coupon.startDate || now > coupon.endDate) {
            throw new BadRequestError('Mã giảm giá đã hết hạn hoặc chưa được kích hoạt');
        }

        // Kiểm tra còn lượt dùng không
        if (coupon.quantity <= 0) {
            throw new BadRequestError('Mã giảm giá đã hết lượt sử dụng');
        }

        // Kiểm tra điều kiện giá tối thiểu
        if (cart.totalCartPrice < coupon.minPrice) {
            throw new BadRequestError(`Đơn hàng phải tối thiểu ${coupon.minPrice} VND để dùng mã này`);
        }

        // Tính giảm
        const discountAmount = (cart.totalCartPrice * coupon.discount) / 100;
        const finalPrice = cart.totalCartPrice - discountAmount;

        // Cập nhật cart
        cart.coupon = {
            code: coupon.nameCoupon,
            discount: coupon.discount,
            discountAmount,
        };

        cart.nameCounpon = coupon.nameCoupon;

        cart.finalPrice = finalPrice;

        await cart.save();

        await coupon.save();

        return cart;
    }

    async getCartByUserId(userId) {
        const cart = await Cart.findOne({ user: userId }).populate('items.product');

        if (!cart) {
            return { cart: null, coupon: [] };
        }

        const today = new Date();

        const coupon = await Coupon.find({
            startDate: { $lte: today },
            endDate: { $gte: today },
            minPrice: { $lte: cart.totalCartPrice },
            quantity: { $gt: 0 },
        }).lean();
        return { cart, coupon };
    }

    async updateCart(userId, itemId, quantity) {
        const cart = await Cart.findOne({ user: userId });
        if (!cart) throw new BadRequestError('Giỏ hàng không tồn tại');

        const item = cart.items.id(itemId);
        if (!item) throw new BadRequestError('Item không tồn tại');

        // Cập nhật số lượng
        item.quantity = quantity;
        item.totalItemPrice =
            quantity.adult * item.priceSnapshot.adult +
            quantity.child * item.priceSnapshot.child +
            quantity.baby * item.priceSnapshot.baby;

        // Cập nhật tổng giỏ
        cart.totalCartPrice = cart.items.reduce((sum, i) => sum + i.totalItemPrice, 0);

        await cart.save();
        return cart;
    }

    async deleteCartItem(userId, itemId) {
        const cart = await Cart.findOne({ user: userId });
        if (!cart) {
            throw new BadRequestError('Giỏ hàng không tồn tại');
        }

        // Lọc item ra khỏi giỏ hàng
        cart.items = cart.items.filter((i) => i._id.toString() !== itemId);

        // Nếu sau khi xóa, giỏ hàng rỗng → xóa luôn cả giỏ hàng
        if (cart.items.length === 0) {
            await Cart.deleteOne({ user: userId });
            return { message: 'Đã xóa sản phẩm cuối cùng, giỏ hàng trống' };
        }

        // Tính lại tổng giá
        cart.totalCartPrice = cart.items.reduce((sum, i) => sum + i.totalItemPrice, 0);

        await cart.save();
        return cart;
    }

    async updateCartInfo(userId, email, phone, fullName, address) {
        const cart = await Cart.findOne({ user: userId });
        if (!cart) throw new BadRequestError('Giỏ hàng không tồn tại');

        cart.email = email;
        cart.phone = phone;
        cart.fullName = fullName;
        cart.address = address;

        await cart.save();
        return cart;
    }
}

module.exports = new CartService();

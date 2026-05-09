const CartService = require('../services/cart.service');
const { OK } = require('../core/success.response');

class CartController {
    async createCart(req, res) {
        const { id } = req.user;
        const { departureScheduleId, quantity, productId } = req.body;
        const cart = await CartService.createCart(id, departureScheduleId, quantity, productId);
        new OK({ message: 'success', metadata: cart }).send(res);
    }

    async getCartByUserId(req, res) {
        const { id } = req.user;
        const cart = await CartService.getCartByUserId(id);
        new OK({ message: 'success', metadata: cart }).send(res);
    }

    async updateCart(req, res) {
        const { id } = req.user;
        const { itemId, quantity } = req.body;
        const cart = await CartService.updateCart(id, itemId, quantity);
        new OK({ message: 'success', metadata: cart }).send(res);
    }

    async applyCoupon(req, res) {
        const { id } = req.user;
        const { nameCoupon } = req.body;
        const cart = await CartService.applyCoupon(id, nameCoupon);
        new OK({ message: 'success', metadata: cart }).send(res);
    }

    async deleteCartItem(req, res) {
        const { id } = req.user;
        const { itemId } = req.params;
        const cart = await CartService.deleteCartItem(id, itemId);
        new OK({ message: 'success', metadata: cart }).send(res);
    }

    async updateCartInfo(req, res) {
        const { id } = req.user;
        const { email, phone, fullName, address } = req.body;
        const cart = await CartService.updateCartInfo(id, email, phone, fullName, address);
        new OK({ message: 'success', metadata: cart }).send(res);
    }
}

module.exports = new CartController();

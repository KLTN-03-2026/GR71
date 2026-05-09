const express = require('express');
const router = express.Router();

const cartController = require('../controller/cart.controller');

const { asyncHandler, authUser } = require('../auth/checkAuth');

router.post('/create', authUser, asyncHandler(cartController.createCart));
router.get('/get-cart', authUser, asyncHandler(cartController.getCartByUserId));
router.put('/update-item', authUser, asyncHandler(cartController.updateCart));
router.delete('/delete-item/:itemId', authUser, asyncHandler(cartController.deleteCartItem));
router.post('/apply-coupon', authUser, asyncHandler(cartController.applyCoupon));
router.put('/update-cart-info', authUser, asyncHandler(cartController.updateCartInfo));

module.exports = router;

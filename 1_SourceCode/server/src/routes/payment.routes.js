const express = require('express');
const router = express.Router();

const { asyncHandler, authAdmin, authUser } = require('../auth/checkAuth');

const paymentController = require('../controller/payment.controller');

router.post('/create', authUser, asyncHandler(paymentController.createPayment));
router.get('/momo', asyncHandler(paymentController.momoCallback));
router.get('/payment/:idPayment', authUser, asyncHandler(paymentController.getPaymentById));
router.get('/vnpay', asyncHandler(paymentController.vnpayCallback));
router.get('/get-payment-by-user-id', authUser, asyncHandler(paymentController.getPaymentByUserId));
router.get('/get-payment-by-admin', authAdmin, asyncHandler(paymentController.getPaymentByAdmin));
router.put('/update-payment-status/:id', authAdmin, asyncHandler(paymentController.updatePaymentStatus));

module.exports = router;

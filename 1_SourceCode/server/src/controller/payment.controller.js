const PaymentService = require('../services/payment.service');

const { OK } = require('../core/success.response');

class PaymentController {
    async createPayment(req, res, next) {
        const { id } = req.user;
        const { typePayment } = req.body;
        const payment = await PaymentService.createPayment(typePayment, id);
        new OK({ message: 'success', metadata: payment }).send(res);
    }

    async momoCallback(req, res, next) {
        const { orderInfo } = req.query;
        const id = orderInfo.split(' ')[4];
        const payment = await PaymentService.momoCallback(id);
        res.redirect(`${process.env.URL_CLIENT}/payment-success/${payment._id}`);
    }

    async vnpayCallback(req, res, next) {
        const { vnp_ResponseCode, vnp_OrderInfo } = req.query;
        if (vnp_ResponseCode !== '00') {
            res.redirect(`${process.env.URL_CLIENT}`);
            return;
        }

        const id = vnp_OrderInfo.split(' ')[4];
        const payment = await PaymentService.vnpayCallback(id);
        res.redirect(`${process.env.URL_CLIENT}/payment-success/${payment._id}`);
    }

    async getPaymentById(req, res, next) {
        const { idPayment } = req.params;
        const { id } = req.user;
        const payment = await PaymentService.getPaymentById(id, idPayment);
        new OK({ message: 'success', metadata: payment }).send(res);
    }

    async getPaymentByUserId(req, res, next) {
        const { id } = req.user;
        const payments = await PaymentService.getPaymentByUserId(id);
        new OK({ message: 'success', metadata: payments }).send(res);
    }

    async getPaymentByAdmin(req, res, next) {
        const payments = await PaymentService.getPaymentByAdmin();
        new OK({ message: 'success', metadata: payments }).send(res);
    }

    async updatePaymentStatus(req, res, next) {
        const { id } = req.params;
        const { status } = req.body;
        const payment = await PaymentService.updatePaymentStatus(id, status);
        new OK({ message: 'success', metadata: payment }).send(res);
    }
}

module.exports = new PaymentController();

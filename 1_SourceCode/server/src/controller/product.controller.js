const ProductService = require('../services/product.service');

const { OK } = require('../core/success.response');

const modelUser = require('../models/users.model');

const { jwtDecode } = require('jwt-decode');

const socketService = require('../utils/socket.service');

class ProductController {
    async uploadImage(req, res) {
        const image = req.files;
        const data = await ProductService.uploadImage(image);
        new OK({ message: 'success', metadata: data }).send(res);
        a;
    }

    async getProductByAdmin(req, res) {
        const products = await ProductService.getProductByAdmin();
        new OK({ message: 'success', metadata: products }).send(res);
    }

    async createProduct(req, res) {
        const { title, destination, description, category, images, transport, price, departureSchedules } = req.body;
        const product = await ProductService.createProduct(
            title,
            destination,
            description,
            category,
            images,
            transport,
            price,
            departureSchedules,
        );
        new OK({ message: 'success', metadata: product }).send(res);
    }

    async getAllProduct(req, res) {
        const product = await ProductService.getAllProduct();
        new OK({ message: 'success', metadata: product }).send(res);
    }

    async updateProduct(req, res) {
        const { id } = req.params;
        const data = req.body;

        const product = await ProductService.updateProduct(id, data);
        new OK({ message: 'success', metadata: product }).send(res);
    }

    async deleteProduct(req, res) {
        const { id } = req.params;
        const product = await ProductService.deleteProduct(id);
        new OK({ message: 'success', metadata: product }).send(res);
    }

    async getProductById(req, res) {
        const { id } = req.params;
        const token = req.cookies.token;

        let user;
        if (token) {
            const data = jwtDecode(token);
            const findUser = await modelUser.findOne({ _id: data.id });
            user = findUser;
        }

        const product = await ProductService.getProductById(id);
        const data = {
            user: user?.fullName || 'Khách',
            productId: product?._id,
        };
        socketService.emitUsersWatchingProduct('usersWatchingProduct', data);
        new OK({ message: 'success', metadata: product }).send(res);
    }

    async getAllDestination(req, res) {
        const destination = await ProductService.getAllDestination();
        new OK({ message: 'success', metadata: destination }).send(res);
    }

    async searchProduct(req, res) {
        const { destination, date, guests } = req.body;
        const product = await ProductService.searchProduct(destination, date, guests);
        new OK({ message: 'success', metadata: product }).send(res);
    }
}

module.exports = new ProductController();

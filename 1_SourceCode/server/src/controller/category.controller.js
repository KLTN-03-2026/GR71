const CategoryService = require('../services/category.service');
const { OK } = require('../core/success.response');

class CategoryController {
    async uploadImage(req, res) {
        const image = req.file;
        const data = await CategoryService.uploadImage(image);
        new OK({ message: 'success', metadata: data }).send(res);
    }

    async createCategory(req, res) {
        const { categoryName, image, description } = req.body;
        const category = await CategoryService.createCategory(categoryName, image, description);
        new OK({ message: 'success', metadata: category }).send(res);
    }

    async getAllCategory(req, res) {
        const category = await CategoryService.getAllCategory();
        new OK({ message: 'success', metadata: category }).send(res);
    }

    async updateCategory(req, res) {
        const { id, categoryName, image, description } = req.body;
        const category = await CategoryService.updateCategory(id, categoryName, image, description);
        new OK({ message: 'success', metadata: category }).send(res);
    }

    async deleteCategory(req, res) {
        const { id } = req.params;
        const category = await CategoryService.deleteCategory(id);
        new OK({ message: 'success', metadata: category }).send(res);
    }
}

module.exports = new CategoryController();

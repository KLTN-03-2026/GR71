const Category = require('../models/category.model');

class CategoryService {
    async uploadImage(image) {
        return image.filename;
    }

    async createCategory(categoryName, image, description) {
        const category = await Category.create({ categoryName, image, description });
        return category;
    }

    async getAllCategory() {
        const category = await Category.find();
        return category;
    }

    async updateCategory(id, categoryName, image, description) {
        const category = await Category.findByIdAndUpdate(id, { categoryName, image, description });
        return category;
    }

    async deleteCategory(id) {
        const category = await Category.findByIdAndDelete(id);
        return category;
    }
}

module.exports = new CategoryService();

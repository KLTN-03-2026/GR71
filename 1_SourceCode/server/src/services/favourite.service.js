const { BadRequestError } = require('../core/error.response');
const Favourite = require('../models/favourite.model');

class FavouriteService {
    async createFavourite(userId, productId) {
        const findFavourite = await Favourite.findOne({ userId, productId });
        if (findFavourite) {
            const deletedFavourite = await Favourite.findByIdAndDelete(findFavourite._id);
            throw new BadRequestError('Đã xóa tour khỏi yêu thích');
        } else {
            const favourite = await Favourite.create({ userId, productId });
            return favourite;
        }
    }

    async getFavouriteByUserId(userId) {
        const favourite = await Favourite.find({ userId }).populate('productId');
        return favourite;
    }
}

module.exports = new FavouriteService();

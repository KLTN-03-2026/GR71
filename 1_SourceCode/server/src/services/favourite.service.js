const Favourite = require('../models/favourite.model');

class FavouriteService {
    // Toggle: thêm nếu chưa có, xóa nếu đã có
    // Trả về { action: 'added'|'removed', favourite }
    async toggleFavourite(userId, productId) {
        const existing = await Favourite.findOne({ userId, productId });
        if (existing) {
            await Favourite.findByIdAndDelete(existing._id);
            return { action: 'removed', favourite: null };
        }
        const favourite = await Favourite.create({ userId, productId });
        return { action: 'added', favourite };
    }

    async getFavouriteByUserId(userId) {
        const favourites = await Favourite.find({ userId })
            .populate({
                path: 'productId',
                populate: { path: 'category', select: 'categoryName' },
            })
            .sort({ createdAt: -1 });
        return favourites;
    }

    async removeFavourite(userId, productId) {
        await Favourite.findOneAndDelete({ userId, productId });
    }

    async checkIsFavourite(userId, productId) {
        const found = await Favourite.findOne({ userId, productId });
        return !!found;
    }
}

module.exports = new FavouriteService();

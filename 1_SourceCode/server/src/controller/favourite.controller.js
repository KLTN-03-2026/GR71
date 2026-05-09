const FavouriteService = require('../services/favourite.service');
const { OK } = require('../core/success.response');

class FavouriteController {
    async toggleFavourite(req, res) {
        const { id } = req.user;
        const { productId } = req.body;
        const result = await FavouriteService.toggleFavourite(id, productId);
        const message = result.action === 'added' ? 'Đã thêm vào yêu thích' : 'Đã xóa khỏi yêu thích';
        new OK({ message, metadata: result }).send(res);
    }

    async getFavouriteByUserId(req, res) {
        const { id } = req.user;
        const favourites = await FavouriteService.getFavouriteByUserId(id);
        new OK({ message: 'success', metadata: favourites }).send(res);
    }

    async removeFavourite(req, res) {
        const { id } = req.user;
        const { productId } = req.params;
        await FavouriteService.removeFavourite(id, productId);
        new OK({ message: 'Đã xóa khỏi yêu thích', metadata: null }).send(res);
    }

    async checkIsFavourite(req, res) {
        const { id } = req.user;
        const { productId } = req.params;
        const isFavourite = await FavouriteService.checkIsFavourite(id, productId);
        new OK({ message: 'success', metadata: { isFavourite } }).send(res);
    }
}

module.exports = new FavouriteController();

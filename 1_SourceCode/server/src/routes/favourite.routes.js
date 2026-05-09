const express = require('express');
const router = express.Router();

const { asyncHandler, authUser } = require('../auth/checkAuth');
const favouriteController = require('../controller/favourite.controller');

router.post('/toggle', authUser, asyncHandler(favouriteController.toggleFavourite));
router.get('/get-favourite-by-user-id', authUser, asyncHandler(favouriteController.getFavouriteByUserId));
router.delete('/remove/:productId', authUser, asyncHandler(favouriteController.removeFavourite));
router.get('/check/:productId', authUser, asyncHandler(favouriteController.checkIsFavourite));

module.exports = router;

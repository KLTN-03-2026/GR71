const express = require('express');
const router = express.Router();

const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'src/uploads/products');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});

var upload = multer({ storage: storage });

const productController = require('../controller/product.controller');

const { asyncHandler, authUser } = require('../auth/checkAuth');

router.post('/upload-images', authUser, upload.array('image'), asyncHandler(productController.uploadImage));
router.post('/create', authUser, asyncHandler(productController.createProduct));
router.get('/all', asyncHandler(productController.getAllProduct));
router.put('/update/:id', authUser, asyncHandler(productController.updateProduct));
router.delete('/delete/:id', authUser, asyncHandler(productController.deleteProduct));
router.get('/detail/:id', asyncHandler(productController.getProductById));
router.get('/all-destination', asyncHandler(productController.getAllDestination));
router.post('/search', asyncHandler(productController.searchProduct));
router.get('/all-admin', asyncHandler(productController.getProductByAdmin));

module.exports = router;

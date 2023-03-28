const router = require('express').Router();
const productsController = require('../controllers/products');

// * 商品一覧 => /shop
// UI表示 => GET
router.get('/', productsController.getProducts);

module.exports = router;
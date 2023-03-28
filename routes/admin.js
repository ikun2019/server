const router = require('express').Router();
const productsController = require('../controllers/products');

// * 商品追加ページ => /admin/add-product
// UI表示 => GET
router.get('/add-product', productsController.getAddProduct);
// 機能 => POST
router.post('/add-product', productsController.postAddProduct);

module.exports = router;
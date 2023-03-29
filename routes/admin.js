const router = require('express').Router();
const adminController = require('../controllers/admin');

// * 商品追加ページ => /admin/add-product
// UI表示 => GET
router.get('/add-product', adminController.getAddProduct);
// 機能 => POST
router.post('/add-product', adminController.postAddProduct);

// * 商品一覧表示 => /admin/products
// UI表示 GET
router.get('/products', adminController.getProducts);

// * 商品編集=> /admin/products/:productId
// UI表示 => GET
router.get('/products/:productId', adminController.getEditProduct);
// 機能 => PUT
router.put('/products/:productId', adminController.postEditProduct);

module.exports = router;
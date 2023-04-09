const router = require('express').Router();
const adminController = require('../controllers/admin');
const verifyToken = require('../middlewares/verify-token');

// * 商品追加ページ => /api/admin/add-product
// UI表示 => GET
router.get('/add-product', verifyToken, adminController.getAddProduct);
// 機能 => POST
router.post('/add-product', verifyToken, adminController.postAddProduct);

// * 商品一覧表示 => /api/admin/products
// UI表示 GET
router.get('/products', verifyToken, adminController.getProducts);

// * 商品編集=> /api/admin/products/:productId
// UI表示 => GET
router.get('/products/:productId', verifyToken, adminController.getEditProduct);
// 機能 => PUT
router.put('/products/:productId', verifyToken, adminController.postEditProduct);

// * 商品削除=> /api/admin/products/:productId
// 機能 => DELETE
router.delete('/products/:productId', verifyToken, adminController.postDeleteProduct);

module.exports = router;
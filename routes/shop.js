const router = require('express').Router();
const shopsController = require('../controllers/shops');

// * トップ => /index
// UI表示 => GET
router.get('/', shopsController.getIndex);

// * 商品一覧 => /products
// UI表示 => GET
router.get('/products', shopsController.getProducts);

// * 単一商品 => /products/:productId
// UI表示 => GET
router.get('/products/:productId', shopsController.getProduct);

// * cartページの取得 => /cart
// UI表示 => GET
router.get('/cart', shopsController.getCart);

// * cart追加 => /cart
// 機能 => POST
router.post('/cart', shopsController.postCart);

// * cartページの取得 => /checkout
// UI表示 => GET
router.get('/checkout', shopsController.getCheckout);

// * cart削除機能 => /cart
// 機能 => DELETE
router.delete('/cart', shopsController.postCartDeleteProduct);

// * order機能 => /create-order
// 機能 => POST
router.post('/create-order', shopsController.postOrder);

module.exports = router;
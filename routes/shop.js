const router = require('express').Router();
const shopsController = require('../controllers/shops');
const verifyToken = require('../middlewares/verify-token');

// * トップ => /index
// UI表示 => GET
router.get('/', shopsController.getIndex);

// * 商品一覧 => /api/products
// UI表示 => GET
router.get('/products', shopsController.getProducts);

// * 単一商品 => /api/products/:productId
// UI表示 => GET
router.get('/products/:productId', shopsController.getProduct);

// * cartページの取得 => /api/cart
// UI表示 => GET
router.get('/cart', verifyToken, shopsController.getCart);

// * cart追加 => /api/cart
// 機能 => POST
router.post('/cart', verifyToken, shopsController.postCart);

// * cartページの取得 => /api/checkout
// UI表示 => GET
router.get('/checkout', verifyToken, shopsController.getCheckout);
router.post('/clear-cart', verifyToken, shopsController.postClearCart);

// * cart削除機能 => /api/cart
// 機能 => DELETE
router.delete('/cart', verifyToken, shopsController.postCartDeleteProduct);

// * order機能 => /api/create-order
// 機能 => POST
// router.post('/create-order', verifyToken, shopsController.postOrder);

// * ordersの取得 => /api/orders
// UI表示
router.get('/orders', verifyToken, shopsController.getOrders);

// * 請求書の表示 => /api/orders/:orderId
router.get('/orders/:orderId', shopsController.getInvoice);

module.exports = router;
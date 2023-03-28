const router = require('express').Router();
const shopsController = require('../controllers/shops');

// * トップ => /index
// UI表示 => GET
router.get('/', shopsController.getIndex);

// * 商品一覧 => /products
// UI表示 => GET
router.get('/products', shopsController.getProducts);

// * cartページの取得 => /cart
// UI表示 => GET
router.get('/cart', shopsController.getCart);

// * cartページの取得 => /checkout
// UI表示 => GET
router.get('/checkout', shopsController.getCheckout);

module.exports = router;
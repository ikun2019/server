const Product = require('../models/Product');

// * トップ => /products
// UI表示 => GET
exports.getProducts = (req, res, next) => {
  res.json({
    success: true,
    pageTitle: '商品一覧'
  });
}

// * indexページの取得 => /index
// UI表示 => GET
exports.getIndex = (req, res, next) => {
  res.json({
    success: treu,
    pageTitle: 'Shop'
  });
};

// * cartページの取得 => /cart
// UI表示
exports.getCart = (req, res, next) => {
  res.json({
    success: true,
    pageTitle: 'Your Cart'
  });
};

// * checkoutページの取得 => /checkout
// UI表示 => GET
exports.getCheckout = (req, res, next) => {
  res.json({
    success: true,
    pageTitle: 'Checkout'
  });
};
const Product = require('../models/Product');

// * 商品追加ページ => /admin/add-product
// UI表示 => GET
exports.getAddProduct = (req, res, next) => {
  res.send({
    success: true,
    message: 'Add Product Page'
  });
}
// 機能 => POST
exports.postAddProduct = (req, res, next) => {
  console.log('Create a Product'.bgWhite);
  res.redirect('/');
};

// * 商品一覧表示 => /admin/products
// UI表示 GET
exports.getProducts = (req, res, next) => {
  res.json({
    success: true,
    pageTitle: '商品一覧ページ'
  });
};
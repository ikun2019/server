const Product = require('../models/Product');

// * トップ => /products
// UI表示 => GET
exports.getProducts = async (req, res, next) => {
  try {
    const products = await Product.findAll();
    res.status(200).json({
      success: true,
      pageTitle: '商品一覧',
      products: products
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
}

// * indexページの取得 => /index
// UI表示 => GET
exports.getIndex = async (req, res, next) => {
  try {
    const products = await Product.findAll();
    res.status(200).json({
      success: true,
      pageTitle: '商品一覧',
      products: products
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

// * 単一商品 => /products/:productId
// UI表示 => GET
exports.getProduct = async (req, res, next) => {
  const prodId = req.params.productId;
  try {
    const product = await Product.findOne({ where: { id: prodId } });
    res.status(500).json({
      success: true,
      product: product
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
}

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
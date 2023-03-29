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
exports.postAddProduct = async (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  try {
    const product = await Product.create({
      title,
      imageUrl,
      price,
      description
    });
    console.log('Create a Product'.bgWhite);
    res.status(200).json({
      success: true,
      product: product
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

// * 商品一覧表示 => /admin/products
// UI表示 GET
exports.getProducts = (req, res, next) => {
  res.json({
    success: true,
    pageTitle: '商品一覧ページ'
  });
};
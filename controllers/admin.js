const Product = require('../models/Product');

// * 商品追加ページ => /admin/add-product
// UI表示 => GET
exports.getAddProduct = (req, res, next) => {
  res.send({
    success: true,
    message: 'Add Product Page'
  });
};
// 機能 => POST
exports.postAddProduct = async (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  try {
    const product = await req.session.user.createProduct({
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
exports.getProducts = async (req, res, next) => {
  try {
    const products = await req.session.user.getProducts;
    res.json({
      success: true,
      pageTitle: '商品一覧ページ',
      products: products,
      isAuthenticated: req.isLoggedIn
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

// * 商品編集=> /admin/products/:productId
// UI表示 => GET
exports.getEditProduct = async (req, res, next) => {
  const prodId = req.params.productId;
  try {
    const products = await req.session.user.getProducts({ where: { id: prodId } });
    res.status(200).json({
      success: true,
      product: products[0]
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};
// 機能 => PUT
exports.postEditProduct = async (req, res, next) => {
  const prodId = req.params.productId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updatedImageUrl = req.body.imageUrl;
  const updatedDescription = req.body.description;
  try {
    const product = await Product.findOne({ where: { id: prodId } });
    product.title = updatedTitle;
    product.price = updatedPrice;
    product.imageUrl = updatedImageUrl;
    product.description = updatedDescription;
    await product.save();
    res.status(200).json({
      success: true,
      message: 'Updated a Product'
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

// * 商品削除=> /admin/products/:productId
// 機能 => DELETE
exports.postDeleteProduct = async (req, res, next) => {
  const prodId = req.params.productId;
  try {
    const product = await Product.findOne({ where: { id: prodId } });
    await product.destroy();
    res.status(200).json({
      success: true,
      message: 'Productを削除しました'
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};
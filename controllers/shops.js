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
// UI表示 => GET
exports.getCart = async (req, res, next) => {
  const cart = await req.user.getCart();
  const products = cart.getProducts();
  res.json({
    success: true,
    pageTitle: 'Your Cart',
    products: products
  });
};

// * cart追加 => /cart/:productId
// 機能 => POST
exports.postCart = async (req, res, next) => {
  const prodId = req.params.productId;
  let fetchedCart;
  let newQuantity = 1;
  try {
    const cart = await req.user.getCart();
    fetchedCart = cart;
    const cartProducts = await cart.getProducts({ where: { id: prodId } });
    // 既にcartに商品が追加されている場合
    let cartProduct;
    if (cartProducts.length > 0) {
      cartProduct = cartProducts[0];
    }
    if (cartProduct) {
      const oldQuantity = cartProduct.cartItem.quantity;
      newQuantity = oldQuantity + 1;
      fetchedCart.addProduct(cartProduct, {
        through: { quantity: newQuantity }
      });
    } else {
      // 商品が格納されていない場合
      const product = await Product.findByPk(prodId);
      fetchedCart.addProduct(product, {
        through: { quantity: newQuantity }
      });
    }
    res.status(200).json({
      success: true
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

// * checkoutページの取得 => /checkout
// UI表示 => GET
exports.getCheckout = (req, res, next) => {
  res.json({
    success: true,
    pageTitle: 'Checkout'
  });
};
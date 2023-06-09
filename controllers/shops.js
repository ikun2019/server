const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');
const Product = require('../models/Product');
const Cart = require('../models/Cart');
const Order = require('../models/Order');
const stripe = require('stripe')(process.env.STRIPE_SECRET);

const ITEMS_PER_PAGE = 2;

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
    const page = req.query.page || 1;
    const { count, rows: products } = await Product.findAndCountAll({
      limit: ITEMS_PER_PAGE,
      offset: ITEMS_PER_PAGE * (page - 1)
    });
    const pageCount = Math.ceil(count / ITEMS_PER_PAGE);

    res.status(200).json({
      success: true,
      pageTitle: '商品一覧',
      products: products,
      currentPage: page,
      hasNextPage: ITEMS_PER_PAGE * page < count,
      hasPreviosPage: page > 1,
      nextPage: parseInt(page) + 1,
      previosPage: parseInt(page) - 1,
      pageCount: pageCount
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
}

// * cartページの取得 => /cart
// UI表示 => GET
exports.getCart = async (req, res, next) => {
  const cart = await req.session.user.getCart();
  const products = await cart.getProducts();
  res.json({
    success: true,
    pageTitle: 'Your Cart',
    products: products,
    isAuthenticated: req.isLoggedIn
  });
};

// * cart追加 => /api/cart
// 機能 => POST
exports.postCart = async (req, res, next) => {
  const prodId = req.body.productId;
  let fetchedCart;
  let newQuantity = 1;
  try {
    const cart = await req.session.user.getCart();
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
exports.getCheckout = async (req, res, next) => {
  try {
    const cart = await req.user.getCart();
    const products = await cart.getProducts();
    let total = 0;
    products.forEach(product => {
      total += product.price * product.cartItem.quantity;
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: products.map(product => {
        return {
          quantity: product.cartItem.quantity,
          price_data: {
            currency: 'usd',
            unit_amount: product.price * 100,
            product_data: {
              name: product.title,
              description: product.description
            }
          }
        }
      }),
      success_url: 'http://localhost:8080/orders',
      cancel_url: 'http://localhost:8080/checkout'
    });

    res.status(200).json({
      success: true,
      pageTitle: 'Checkout',
      products: products,
      totalSum: total,
      sessionId: session.id
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};
// * => /api/clear-cart
exports.postClearCart = async (req, res, next) => {
  try {
    console.log('カートをクリアしているよ')
    const cart = await req.user.getCart();
    const products = await cart.getProducts();
    const order = await req.user.createOrder();
    await order.addProducts(products.map(product => {
      product.orderItem = { quantity: product.cartItem.quantity };
    }));
    await cart.setProducts(null);
    res.status(200).json({
      success: true,
      message: 'Ordered'
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
}

// * Checkout Success GET => /api/checkout/success
exports.getCheckoutSuccess = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true
    });
  } catch (err) {
    res.status(500).json({
      success: false
    });
  }
};

// * cart削除機能 => /api/cart
// 機能 => DELETE
exports.postCartDeleteProduct = async (req, res, next) => {
  const prodId = req.body.productId;
  console.log(prodId);
  try {
    const cart = await req.session.user.getCart();
    const deleteProducts = await cart.getProducts({ where: { id: prodId } });
    const deleteProduct = deleteProducts[0];
    await deleteProduct.cartItem.destroy();
    res.status(200).json({
      success: true,
      message: 'Deleted Product'
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

// * order機能 => /api/create-order
// 機能 => POST
exports.postOrder = async (req, res, next) => {
  let fetchedCart;
  try {
    const cart = await req.session.user.getCart();
    fetchedCart = cart;
    const products = await fetchedCart.getProducts();
    const order = await req.session.user.createOrder();
    await order.addProducts(products.map(product => {
      product.orderItem = { quantity: product.cartItem.quantity };
    }));
    await fetchedCart.setProducts(null);
    res.status(200).json({
      success: true,
      message: 'Ordered'
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

// * ordersの取得 => /api/orders
// UI表示
exports.getOrders = async (req, res, next) => {
  try {
    const orders = await req.session.user.getOrders({ include: ['products'] });
    res.status(200).json({
      success: true,
      orders: orders
    });
  } catch (err) {
    console.log(err);
  }
};

// * 請求書の表示 => /api/orders/:orderId
exports.getInvoice = async (req, res, next) => {
  try {
    const orderId = req.params.orderId;
    // 注文したユーザーだけが見れるようにする
    const order = await Order.findByPk(orderId, {
      include: [{ model: Product }]
    });
    console.log('order =>', order);
    if (!order) {
      return next(new Error('注文がありません'));
    }
    // if (order.userId !== req.session.user.id) {
    //   return next(new Error('認証されていません'));
    // }

    const invoiceName = 'invoice-' + orderId + '.pdf'
    const invoicePath = path.join('data', 'invoices', invoiceName);

    const pdfDoc = new PDFDocument();
    pdfDoc.pipe(fs.createWriteStream(invoicePath));

    // PDFの中身
    pdfDoc.fontSize(26).text('Invoice', {
      underline: true
    });
    pdfDoc.text('------------------------------');
    let totalPrice = 0;
    order.products.forEach(prod => {
      totalPrice = totalPrice + prod.orderItem.quantity * prod.price;
      pdfDoc.fontSize(14).text(prod.title + '-' + prod.orderItem.quantity + ' x ' + '$' + prod.price);
    });
    pdfDoc.text('------------------------------');
    pdfDoc.fontSize(20).text('Total Price: $' + totalPrice);

    pdfDoc.end();

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'inline; filename="' + invoiceName + '"');
    pdfDoc.pipe(res);
  } catch (err) {
    console.log(err);
  }
};
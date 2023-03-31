const colors = require('colors');
const express = require('express');
const dotenv = require('dotenv');
dotenv.config();
const rootDir = require('./util/path');
const sequelize = require('./config/database');

// * モデルの読み込み
const Product = require('./models/Product');
const User = require('./models/User');
const Cart = require('./models/Cart');
const CartItem = require('./models/CartItem');
const Order = require('./models/Order');
const OrderItem = require('./models/CartItem');

// * routerの読み込み
const adminRouter = require('./routes/admin');
const shopRouter = require('./routes/shop');

// * controllerの読み込み
const errorsController = require('./controllers/errors');

// * appの初期化
const app = express();

// * appの設定
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// * ユーザーのミドルウェア
app.use(async (req, res, next) => {
  try {
    req.user = await User.findByPk(1);
    next();
  } catch (err) {
    console.log(err);
  }
});

// * routerのマウント
app.use('/admin', adminRouter);
app.use('/', shopRouter);
// 404エラー
app.use(errorsController.get404);

// * アソシエーション
User.hasMany(Product);
Product.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });
User.hasOne(Cart);
Cart.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });
Cart.belongsToMany(Product, { through: CartItem });
Product.belongsToMany(Cart, { through: CartItem });
Order.belongsTo(User);
User.hasMany(Order);
Order.belongsToMany(Product, { through: OrderItem });
Product.belongsToMany(Order, { through: OrderItem });

// * サーバーの起動
sequelize
  .sync({ alter: true })
  // .sync({ force: true })
  .then(result => {
    return User.findByPk(1);
  })
  .then(user => {
    if (!user) {
      return User.create({ name: 'max', email: 'dummy@test.com' });
    }
    return user;
  })
  .then(user => {
    if (!user.cart) {
      return user.createCart();
    }
  })
  .then(result => {
    app.listen(process.env.PORT, () => {
      console.log('サーバー起動'.bgGreen);
    });
  })
  .catch(err => {
    console.log(err);
  });

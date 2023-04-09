const colors = require('colors');
const express = require('express');
const dotenv = require('dotenv');
dotenv.config();
const rootDir = require('./util/path');
const sequelize = require('./config/database');
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const cors = require('cors');

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
const authRouter = require('./routes/auth');

// * controllerの読み込み
const errorsController = require('./controllers/errors');

// * appの初期化
const app = express();
const store = new SequelizeStore({
  db: sequelize,
  expires: 1800000
});

// * appの設定
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:8080',
  optionsSuccessStatus: 200
}));
app.use(session({
  secret: process.env.SESSION_SECRET,
  store: store,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 60 * 60 * 1000
  }
}));
// app.use(async (req, res, next) => {
//   try {
//     req.user = null;
//     if (req.session.user) {
//       const user = await User.findByPk(req.session.user.id);
//       if (!user) {
//         return next();
//       }
//       req.user = user;
//       console.log('app.jsリクエストユーザー =>', req.user);
//     }
//     next();
//   } catch (err) {
//     console.log(err);
//   }
// });

// * routerのマウント
app.use('/api/admin', adminRouter);
app.use('/api', shopRouter);
app.use('/api/auth', authRouter);
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
    app.listen(process.env.PORT, () => {
      console.log('サーバー起動'.bgGreen);
    });
  })
  .catch(err => {
    console.log(err);
  });
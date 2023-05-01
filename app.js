const colors = require('colors');
const express = require('express');
const dotenv = require('dotenv');
dotenv.config();
const rootDir = require('./util/path');
const sequelize = require('./config/database');
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const auth = require('./middlewares/auth');

const { graphqlHTTP } = require('express-graphql');
const graphqlSchema = require('./graphql/schema');
const graphqlResolver = require('./graphql/resolvers');

// * モデルの読み込み
const Product = require('./models/Product');
const User = require('./models/User');
const Cart = require('./models/Cart');
const CartItem = require('./models/CartItem');
const Order = require('./models/Order');
const OrderItem = require('./models/CartItem');
const Post = require('./models/Post');

// * routerの読み込み
// const adminRouter = require('./routes/admin');
// const shopRouter = require('./routes/shop');
// const authRouter = require('./routes/auth');

// * controllerの読み込み
const errorsController = require('./controllers/errors');

// * appの初期化
const app = express();
const store = new SequelizeStore({
  db: sequelize,
  expires: 1800000
});

// * multerの初期設定
// 保存先とファイル名の設定
const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'images');
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString() + '-' + file.originalname);
  }
});
// ファイルフィルターの導入
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'jpeg') {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

// * appの設定
app.use(express.urlencoded({ extended: false }));
app.use(multer({ storage: fileStorage, fileFilter: fileFilter }).single('image'));
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:8080',
  optionsSuccessStatus: 200,
  credentials: true
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
app.use(auth);
app.use('/graphql', graphqlHTTP({
  schema: graphqlSchema,
  rootValue: graphqlResolver,
  graphiql: true,
  formatError(err) {
    if (!err.originalError) {
      return err;
    }
    const data = err.originalError.data;
    const message = err.message || 'An error occurred';
    const code = err.originalError.code || 500;
    return { message: message, status: code, data: data };
  },
}));

// * routerのマウント
// app.use('/api/admin', adminRouter);
// app.use('/api', shopRouter);
// app.use('/api/auth', authRouter);
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
User.hasMany(Post, { as: 'posts' });
Post.belongsTo(User);

// * サーバーの起動
sequelize
  // .sync({ alter: true })
  // .sync({ force: true })
  .sync()
  .then(result => {
    app.listen(process.env.PORT, () => {
      console.log('サーバー起動'.bgGreen);
    });
  })
  .catch(err => {
    console.log(err);
  });
const colors = require('colors');
const express = require('express');
const dotenv = require('dotenv');
dotenv.config();
const rootDir = require('./util/path');
const sequelize = require('./config/database');

// * routerの読み込み
const adminRouter = require('./routes/admin');
const shopRouter = require('./routes/shop');

// * controllerの読み込み
const errorsController = require('./controllers/errors');

// * appの初期化
const app = express();

// * appの設定
app.use(express.urlencoded({ extended: false }));

// * routerのマウント
app.use('/admin', adminRouter);
app.use('/', shopRouter);
// 404エラー
app.use(errorsController.get404);

// * サーバーの起動
sequelize
  .sync()
  .then(result => {
    app.listen(process.env.PORT, () => {
      console.log('サーバー起動'.bgGreen);
    });
  })
  .catch(err => {
    console.log(err);
  });

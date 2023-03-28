const colors = require('colors');
const express = require('express');
const dotenv = require('dotenv');
dotenv.config();

// * routerの読み込み
const adminRouter = require('./routes/admin');
const shopRouter = require('./routes/shop');

// * appの初期化
const app = express();

// * appの設定
app.use(express.urlencoded({ extended: false }));

// * routerのマウント
app.use('/admin', adminRouter);
app.use('/shop', shopRouter);
// 404エラー
app.use((req, res, next) => {
  res.status(404).send('404');
});

// * サーバーの起動
app.listen(process.env.PORT, () => {
  console.log('サーバー起動'.bgGreen);
});
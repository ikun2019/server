const router = require('express').Router();
const authController = require('../controllers/auth');
const verifyToken = require('../middlewares/verify-token');
const { check, body } = require('express-validator');
const User = require('../models/User');

// * ログインページ => /api/auth/login
// UI表示
router.get('/login', authController.getLogin);
// 機能
router.post('/login',
  [
    body('email')
      .isEmail()
      .withMessage('有効なemailを入力してください')
      .normalizeEmail(),
    body('password', 'パスワードが入力されていません')
      .isLength({ min: 5 })
      .isAlphanumeric()
      .trim()
  ],
  authController.postLogin);

// * サインアップページ => /api/auth/signup
// 機能
router.post('/signup',
  [
    check('email')
      .isEmail()
      .withMessage('emailが不正です')
      .custom((value, { req }) => {
        return User.findOne({ where: { email: value } })
          .then(user => {
            if (user) {
              return Promise.reject('emailは既に存在します');
            }
          })
      })
      .normalizeEmail(),
    body('password', 'パスワードは５文字以上で入力してください')
      .isLength({ min: 5 })
      .isAlphanumeric()
      .trim(),
    body('confirmPassword')
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error('パスワードが一致しません')
        }
        return true;
      })
  ],
  authController.postSignup);

// * ログアウト機能 => /api/auth/logout
// 機能
router.post('/logout', authController.postLogout);

// * nuxt authのエンドポイント => /api/auth/user
// UI表示
router.get('/user', verifyToken, authController.getUser);

// * パスワードリセット機能 => /api/auth/reset
// 機能
router.post('/reset', authController.postReset);

// * 新しいパスワードの設定画面 => /api/auth/new-password
// UI表示
router.get('/new-password/:token', authController.getNewPassword);
// 機能
router.post('/new-password', authController.postNewPassword);

module.exports = router;
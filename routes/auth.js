const router = require('express').Router();
const authController = require('../controllers/auth');
const verifyToken = require('../middlewares/verify-token');
const { check } = require('express-validator');

// * ログインページ => /api/auth/login
// UI表示
router.get('/login', authController.getLogin);
// 機能
router.post('/login', authController.postLogin);

// * サインアップページ => /api/auth/signup
// 機能
router.post('/signup', check('email').isEmail().withMessage('emailが不正です'), authController.postSignup);

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
const router = require('express').Router();
const authController = require('../controllers/auth');

// * ログインページ => /api/auth/login
// UI表示
router.get('/login', authController.getLogin);
// 機能
router.post('/login', authController.postLogin);

// * サインアップページ => /api/auth/signup
// 機能
router.post('/signup', authController.postSignup);

// * ログアウト機能 => /api/auth/logout
// 機能
router.post('/logout', authController.postLogout);

// * nuxt authのエンドポイント => /api/auth/user
// UI表示
router.get('/user', authController.getUser);

module.exports = router;
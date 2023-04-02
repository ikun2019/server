const router = require('express').Router();
const authController = require('../controllers/auth');

// * ログインページ => /api/login
// UI表示
router.get('/login', authController.getLogin);
// 機能
router.post('/login', authController.postLogin);

module.exports = router;
const router = require('express').Router();

// * 商品一覧 => /shop
// UI表示 => GET
router.get('/', (req, res, next) => {
  res.json({
    success: true,
    message: 'Shop Page'
  });
});

module.exports = router;
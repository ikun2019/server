const router = require('express').Router();

// * 商品追加ページ => /admin/add-product
// UI表示 => GET
router.get('/add-product', (req, res, next) => {
  res.send({
    success: true,
    message: 'Add Product Page'
  });
});
// 機能 => POST
router.post('/add-product', (req, res, next) => {
  console.log('Create a Product'.bgWhite);
  res.redirect('/');
});

module.exports = router;
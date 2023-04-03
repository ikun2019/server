// * ログインページ => /api/login
// UI表示
exports.getLogin = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      path: '/login'
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};
// 機能
exports.postLogin = async (req, res, next) => {
  try {
    const foundUser = await User.findOne({ where: { email: req.body.email } });
    if (!foundUser) {
      return res.status(403).json({
        success: false,
        message: 'ユーザーが見つかりません'
      });
    }
    const isMatch = await foundUser.comparePassword(req.body.password);
    if (!isMatch) {
      return res.status(403).json({
        success: false,
        message: 'パスワードが一致しません'
      });
    }
    const token = foundUser.getSignedJwtToken();
    req.isLoggedIn = true;
    res.status(200).json({
      success: true,
      token
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};
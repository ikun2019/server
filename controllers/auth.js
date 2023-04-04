const User = require('../models/User');

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

// * サインアップページ => /api/signup
// 機能
exports.postSignup = async (req, res, next) => {
  try {
    const user = await new User();
    user.name = req.body.name;
    user.email = req.body.email;
    user.password = req.body.password;
    console.log('user =>', req.body.name, req.body.email, req.body.password);
    await user.save();

    console.log('user =>', user);

    const token = user.getSignedJwtToken();
    console.log('token =>', token);
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
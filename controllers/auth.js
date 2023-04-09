const sequelize = require('../config/database');
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
      return res.status(401).json({
        success: false,
        message: 'ユーザーが見つかりません'
      });
    }
    const isMatch = await foundUser.comparePassword(req.body.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'パスワードが一致しません'
      });
    }
    const token = foundUser.getSignedJwtToken();

    req.session.user = foundUser;

    const cart = await req.session.user.getCart();
    if (!cart) {
      await req.sesion.user.createCart();
    }

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
    await user.save();

    const token = user.getSignedJwtToken();

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

// * ログアウト機能 => /api/auth/logout
// 機能
exports.postLogout = async (req, res, next) => {
  try {
    const sessionId = req.sessionID;
    await req.session.destroy(err => {
      sequelize.models.Session.destroy({
        where: {
          sid: sessionId
        }
      });
    });
    res.status(200).json({
      success: true
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

// * nuxt authのエンドポイント => /api/auth/user
// UI表示
exports.getUser = async (req, res, next) => {
  try {
    const user = await User.findOne({ where: { id: req.session.user.id } });
    if (user) {
      res.status(200).json({
        success: true,
        user: user
      });
    } else {
      res.status(200).json({
        success: true,
        user: null
      });
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
}
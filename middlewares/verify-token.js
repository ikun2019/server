const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = async function (req, res, next) {
  try {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    };
    if (!token) {
      return next(new Error('tokenが見つかりません'));
    };
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ where: { id: decoded.id } });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: '認証情報が切れています'
      });
    }
    req.session.user = user;
    req.user = user;
    next();
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};
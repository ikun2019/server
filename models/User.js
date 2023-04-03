const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = sequelize.define('user', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  }
});

// JWT署名
User.prototype.getSignedJwtToken = function () {
  return jwt.sign(
    { id: this.id },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE }
  );
};
// パスワードのハッシュ化
User.beforeCreate(async (user) => {
  const salt = await bcrypt.getSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
});

module.exports = User;
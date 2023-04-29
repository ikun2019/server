const bcrypt = require('bcryptjs');
const validator = require('validator');
const User = require('../models/User');

module.exports = {
  createUser: async function (args, req) {
    const errors = [];
    if (!validator.isEmail(args.userInput.email)) {
      errors.push({ message: "emailが空です" });
    }
    if (validator.isEmpty(args.userInput.password) || !validator.isLength(args.userInput.password, { min: 5 })) {
      errors.push({ message: 'パスワードが短いです' });
    }
    if (errors.length > 0) {
      const error = new Error('Invalid Input');
      error.data = errors;
      error.code = 422;
      throw error;
    }
    const existingUser = await User.findOne({
      where: { email: args.userInput.email }
    });
    if (existingUser) {
      throw new Error('すでにユーザーが存在します');
    }
    const hashedPassword = await bcrypt.hash(args.userInput.password, 12);
    const user = new User({
      email: args.userInput.email,
      name: args.userInput.name,
      password: hashedPassword,
    });
    const createdUser = await user.save();
    return {
      // ...createdUser,
      id: createdUser.id,
      email: createdUser.email,
    }
  },
  login: async (args, req) => {
    try {
      const user = await User.findOne({
        where: { email: args.email }
      });
      if (!user) {
        throw new Error('ユーザーが存在しません');
      }
      const isMatch = await user.comparePassword(args.password);
      if (!isMatch) {
        throw new Error('パスワードが違います');
      }
      const token = await user.getSignedJwtToken();
      return {
        token,
        user,
      }
    } catch (err) {
      console.error(err);
    }
  }
}
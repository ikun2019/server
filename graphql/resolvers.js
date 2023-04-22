const bcrypt = require('bcryptjs');
const User = require('../models/User');

module.exports = {
  createUser: async function (args, req) {
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
  }
}
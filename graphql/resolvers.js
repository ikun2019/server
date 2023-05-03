const bcrypt = require('bcryptjs');
const validator = require('validator');
const User = require('../models/User');
const Post = require('../models/Post');

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
    // const hashedPassword = await bcrypt.hash(args.userInput.password, 12);
    const user = new User({
      email: args.userInput.email,
      name: args.userInput.name,
      password: args.userInput.password,
    });
    const createdUser = await user.save();
    console.log(createdUser);
    const token = await createdUser.getSignedJwtToken();
    return {
      token: token,
      user: createdUser,
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
  },
  createPost: async (args, req) => {
    try {
      const errors = [];
      if (!req.isAuth) {
        const error = new Error('認証されていません');
        error.code = 401;
        throw error;
      }
      console.log('req.isAuth =>', req.isAuth);
      if (validator.isEmpty(args.postInput.title || !validator.isLength(args.postInput.title, { min: 5 }))) {
        errors.push({ message: 'タイトルがありません' });
      }
      if (validator.isEmpty(args.postInput.content || !validator.isLength(args.postInput.content, { min: 5 }))) {
        errors.push({ message: 'コンテンツがありません' });
      }
      if (errors.length > 0) {
        const error = new Error('Invalid input');
        error.data = errors;
        error.code = 422;
        throw error;
      }
      const user = await User.findOne({
        where: { id: req.userId }
      });
      console.log('user =>', user);
      if (!user) {
        const error = new Error('ユーザーがいません');
        error.code = 401;
        throw error;
      }
      const post = {
        title: args.postInput.title,
        content: args.postInput.content,
        imageUrl: args.postInput.imageUrl,
        creator: user,
      };
      const createPost = await user.createPost(post);
      console.log('createPost =>', createPost.userId);
      return {
        id: createPost.id,
        title: createPost.title,
        content: createPost.content,
        imageUrl: createPost.imageUrl,
        creator: user,
        createdAt: createPost.userId,
        updatedAt: createPost.updatedAt,
      };
    } catch (err) {
      console.error(err);
      throw err;
    }
  },
  getPosts: async (args, req) => {
    try {
      if (!req.isAuth) {
        const error = new Error('認証されていません');
        error.code = 401;
        throw error;
      }
      if (!args.page) {
        args.page = 1;
      }
      const perPage = 2;
      const response = await Post.findAndCountAll({
        offset: (args.page - 1) * perPage,
        limit: perPage,
        order: [
          ['createdAt', 'DESC']
        ],
        include: [{ model: User }],
      });
      const totalPosts = response.count;
      const posts = response.rows;
      return {
        posts: posts,
        totalPosts: totalPosts,
      }
    } catch (err) {
      console.error(err);
    }
  },
}
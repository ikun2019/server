const { buildSchema } = require('graphql');

module.exports = buildSchema(`
  type AuthData {
    token: String!
    user: User!
  }
  type Post {
    id: ID!
    title: String!
    content: String!
    imageUrl: String!
    creator: User
    createdAt: String!
    updatedAt: String!
  }
  type PostData {
    posts: [Post!]!
    totalPosts: Int!
  }
  type User {
    id: ID!
    name: String!
    email: String!
    password: String!
    status: String!
    posts: [Post!]!
  }
  input UserInputData {
    email: String!
    name: String!
    password: String!
  }
  input PostInputData {
    title: String!
    content: String!
    imageUrl: String!
  }

  type RootQuery {
    posts: PostData!
  }
  type RootMutation {
    createUser(userInput: UserInputData): AuthData!
    login(email: String!, password: String!): AuthData!
    createPost(postInput: PostInputData): Post!
  }
  schema {
    query: RootQuery,
    mutation: RootMutation
  }
`);
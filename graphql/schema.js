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
    creator: User!
    createdAt: String!
    updatedAt: String!
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
    hello: String!
  }
  type RootMutation {
    createUser(userInput: UserInputData): User!
    login(email: String!, password: String!): AuthData!
    createPost(postInput: PostInputData): Post!
  }
  schema {
    query: RootQuery,
    mutation: RootMutation
  }
`);
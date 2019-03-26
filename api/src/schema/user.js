const { gql } = require("apollo-server-express");

module.exports = gql`
  extend type Query {
    user(id: ID!): User
    users: [User!]!
    me: User
  }

  extend type Mutation {
    signUp(email: String!, password: String!): Token!
    signIn(email: String!, password: String!): Token!
  }

  type User {
    id: ID!
    email: String!
    firstName: String!
    lastName: String!
    campusId: String
    officePhone: String
    mobilePhone: String
  }

  type Token {
    token: String!
  }
`;

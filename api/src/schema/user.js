const { gql } = require("apollo-server-express");

module.exports = gql`
  extend type Query {
    user(id: ID!): User
    users: [User!]!
    me: User
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
`;

const { gql } = require("apollo-server-express");

module.exports = gql`
  extend type Query {
    course(id: ID!): Course
    courses: [Course!]!
  }

  type Course {
    id: ID!
    number: String!
    title: String!
  }
`;

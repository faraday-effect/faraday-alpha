const { gql } = require("apollo-server-hapi");

const typeDefs = gql`
  type Course {
    code: String!
    name: String!
  }
  type Query {
    courseCount: Int!
    courses: [Course!]!
  }
`;

module.exports = typeDefs;

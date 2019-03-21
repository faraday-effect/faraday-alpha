const { gql } = require("apollo-server-hapi");

const typeDefs = gql`
  type Course {
    id: ID!
    code: String!
    name: String!
  }
  type Query {
    courseCount: Int!
    courses: [Course!]!
  }
  type Mutation {
    addCourse(code: String!, name: String!): Course
  }
`;

module.exports = typeDefs;

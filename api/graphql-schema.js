const { gql } = require("apollo-server-hapi");

const typeDefs = gql`
  type User {
    id: ID!
    username: String!
  }

  type Course {
    id: ID!
    number: String!
    title: String!
  }

  type Query {
    courseCount: Int!
    courses: [Course!]!
    me: User
    allUsers: [User!]!
  }

  type Mutation {
    addCourse(number: String!, title: String!): Course
    signUp(username: String!, password: String!): String
    login(username: String!, password: String!): String
  }
`;

module.exports = typeDefs;

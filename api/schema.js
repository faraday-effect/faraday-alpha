const { gql } = require("apollo-server-hapi");

const typeDefs = gql`
  type Query {
    courseCount: Int!
  }
`;

module.exports = typeDefs;

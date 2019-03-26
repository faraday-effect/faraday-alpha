const { gql } = require("apollo-server-express");

const userSchema = require("./user");
const courseSchema = require("./course");

const linkSchema = gql`
  type Query {
    _: Boolean
  }

  type Mutation {
    _: Boolean
  }
`;

const pingPongSchema = gql`
  extend type Query {
    ping: Pong!
  }
  
  type Pong {
      arch: String!
      cpus: [String!]!
      platform: String!
      release: String!
      hostname: String!
  }
`;

module.exports = [linkSchema, pingPongSchema, userSchema, courseSchema];

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

module.exports = [
  linkSchema,
  userSchema,
  courseSchema
];

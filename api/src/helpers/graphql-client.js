const { GraphQLClient } = require("graphql-request");

const endpoint = "http://localhost:4000/graphql";

const client = new GraphQLClient(endpoint);

module.exports = client;

const { createTestClient } = require("apollo-server-testing");
const { ApolloServer } = require("apollo-server-express");

const FaradayAPI = require("../datasources/faraday/api");
const typeDefs = require("../schemata");
const resolvers = require("../resolvers");

const server = new ApolloServer({
  typeDefs,
  resolvers,
  dataSources: () => ({
    faradayAPI: new FaradayAPI()
  })
});

const client = createTestClient(server);

module.exports = client;

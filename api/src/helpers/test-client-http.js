const { createHttpLink } = require("apollo-link-http");
const { InMemoryCache } = require("apollo-cache-inmemory");
const { ApolloClient } = require("apollo-client");

const client = new ApolloClient({
  link: createHttpLink({
    uri: "http://localhost:4000/graphql",
    fetch: require("node-fetch")
  }),
  cache: new InMemoryCache()
});

module.exports = client;

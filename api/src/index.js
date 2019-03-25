require("dotenv").config();

const express = require("express");
const morgan = require("morgan");
// const jwt = require("jsonwebtoken");

const { ApolloServer } = require("apollo-server-express");
const FaradayAPI = require("../datasources/faraday/api");

const index = new ApolloServer({
  typeDefs: require("./schema"),
  resolvers: require("./resolvers"),
  dataSources: () => ({
    faradayAPI: new FaradayAPI()
  })
});

const app = express();

// Log requests.
app.use(morgan("dev"));

index.applyMiddleware({ app, path: "/graphql" });

const host = "localhost";
const port = 4000;

app.listen({ host, port }, () =>
  console.log(
    `🚀 Server listening on http://${host}:${port}${index.graphqlPath}`
  )
);

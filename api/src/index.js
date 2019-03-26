require("dotenv").config();

const express = require("express");
const morgan = require("morgan");
const jwt = require("jsonwebtoken");

const { ApolloServer, AuthenticationError } = require("apollo-server-express");
const FaradayAPI = require("../datasources/faraday/api");

async function getMe(req) {
  const header = req.get("Authorization");
  const token = header ? header.split(" ")[1] : null;

  if (token) {
    try {
      return await jwt.verify(token, process.env.JWT_SECRET);
    } catch (e) {
      throw new AuthenticationError("Session expired; sign in again");
    }
  }

  return null;
}

const index = new ApolloServer({
  typeDefs: require("./schema"),
  resolvers: require("./resolvers"),
  dataSources: () => ({
    faradayAPI: new FaradayAPI()
  }),
  context: async ({ req }) => {
    const me = await getMe(req);
    return { me };
  }
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

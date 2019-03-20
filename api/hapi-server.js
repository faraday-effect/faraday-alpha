const { ApolloServer } = require("apollo-server-hapi");
const typeDefs = require("./schema");

const Hapi = require("hapi");

// hapi.route({
//   method: "GET",
//   path: "/hello",
//   handler: function(request, h) {
//     return "hello world";
//   }
// });

console.log("DEFS", JSON.stringify(typeDefs, null, 4));

async function start() {
  const apollo = new ApolloServer({ typeDefs });

  const hapi = Hapi.server({
    port: 4000,
    host: "localhost"
  });

  await apollo.applyMiddleware({ app: hapi });

  await apollo.installSubscriptionHandlers(hapi.listener);

  await hapi.register({
    plugin: require("hapi-pino"),
    options: {
      prettyPrint: true,
      logEvents: ["response", "onPostStart"]
    }
  });

  try {
    await hapi.start();
  } catch (err) {
    console.log(err);
    process.exit(1);
  }

  console.log(`Server running at: ${hapi.info.uri}`);
}

process.on("unhandledRejection", err => {
  console.log(err);
  process.exit(1);
});

start();

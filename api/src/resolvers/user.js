// Resolver signature: foo(parent, args, context, info)

const jwt = require("jsonwebtoken");

async function createToken(user, expiresIn = "1d") {
  const { id, email, username } = user;
  return await jwt.sign({ id, email, username }, process.env.JWT_SECRET, {
    expiresIn
  });
}

module.exports = {
  Query: {
    user: (_, { id }, { dataSources }) => dataSources.faradayAPI.userById(id),

    users: (_, __, { dataSources }) => dataSources.faradayAPI.allUsers(),

    me: (_, __, { me }) => me
  },
  Mutation: {
    signUp: async (_, { email, password }, { dataSources }) => {
      const user = await dataSources.faradayAPI.createUser(email, password);
      return {
        token: createToken(user, "30m")
      };
    },

    signIn: async (_, { email, password }, { dataSources }) => {
      const user = await dataSources.faradayAPI.authenticateUser(
        email,
        password
      );
      return {
        token: createToken(user, "1d")
      };
    }
  }
};

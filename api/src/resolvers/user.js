// Resolver signature: foo(parent, args, context, info)

const jwt = require("jsonwebtoken");

async function createToken(user) {
  const { id, email, username } = user;
  return await jwt.sign({ id, email, username }, process.env.JWT_SECRET);
}

module.exports = {
  Query: {
    user: (_, { id }) => `user ${id}`,

    users: (_, __, { dataSources }) => dataSources.faradayAPI.allUsers(),

    me: (_, __, { me }) => me
  },
  Mutation: {
    signUp: async (_, { email, password }, { dataSources }) => {
      const user = await dataSources.faradayAPI.createUser(email, password);
      console.log("USER", user);
      return {
        token: createToken(user)
      };
    }
  }
};

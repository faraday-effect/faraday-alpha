// Resolver signature: foo(parent, args, context, info)

module.exports = {
  Query: {
    user: (_, { id }, { dataSources }) => dataSources.faradayAPI.userById(id),

    users: (_, __, { dataSources }) => dataSources.faradayAPI.allUsers(),

    me: (_, __, { me }) => me
  },
  Mutation: {
    signUp: async (_, { input }, { dataSources }) => {
      const user = await dataSources.faradayAPI.createUser(input);
      return {
        user,
        token: user.createToken("30m")
      };
    },

    signIn: async (_, { email, password }, { dataSources }) => {
      const user = await dataSources.faradayAPI.authenticateUser(
        email,
        password
      );
      return {
        user,
        token: user.createToken("1d")
      };
    }
  }
};

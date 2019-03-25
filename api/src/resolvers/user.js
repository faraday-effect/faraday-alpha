// Resolver signature: foo(parent, args, context, info)

module.exports = {
  Query: {
    user: (_, { id }) => `user ${id}`,
    users: () => "user",
    me: (_, __, { me }) => me
  },
  Mutation: {}
};

// Resolver signature: foo(parent, args, context, info)

module.exports = {
  Query: {
    courseCount: (_, __, { dataSources }) =>
      dataSources.faradayAPI.countCourses(),
    courses: (_, __, { dataSources }) => dataSources.faradayAPI.allCourses(),
    me: (_, { user }, { dataSources}) => dataSources.faradayAPI.me(user),
    allUsers: (_, __, { dataSources }) => dataSources.faradayAPI.allUsers()
  },
  Mutation: {
    addCourse(_, args, { dataSources }) {
      return dataSources.faradayAPI.addCourse(args);
    },

    signUp: (_, { username, email, password }, { dataSources }) =>
      dataSources.faradayAPI.signUp(username, email, password),

    login: (_, { email, password }, { dataSources }) =>
      dataSources.faradayAPI.login(email, password)
  }
};

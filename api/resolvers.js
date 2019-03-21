// Resolver signature: foo(parent, args, context, info)

module.exports = {
  Query: {
    courseCount: (_, __, { dataSources }) => dataSources.faradayAPI.countCourses(),
    courses: (_, __, { dataSources }) => dataSources.faradayAPI.allCourses()
  },
  Mutation: {
    addCourse: (_, args, { dataSources }) => {
      return dataSources.faradayAPI.addCourse(args);
    }
  }
};

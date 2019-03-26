const { ForbiddenError } = require("apollo-server-express");

module.exports = {
  Query: {
    course: (_, { id }, { dataSources }) =>
      dataSources.faradayAPI.courseById(id),
    courses: (_, __, { dataSources }) => dataSources.faradayAPI.allCourses()
  },
  Mutation: {
    createCourse: (_, { number, title }, { dataSources, me }) => {
      if (!me) {
        throw new ForbiddenError("Not authenticated");
      }
      return dataSources.faradayAPI.createCourse(number, title);
    }
  }
};

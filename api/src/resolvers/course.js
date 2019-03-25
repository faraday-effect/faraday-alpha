module.exports = {
  Query: {
    course: (_, { id }) => `course ${id}`,
    courses: () => ["courses"]
  },
  Mutation: {}
};

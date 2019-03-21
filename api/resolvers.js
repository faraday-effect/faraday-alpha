const courses = [
  {
    code: "COS 243",
    name: "Multitier Web Application Development"
  },
  {
    code: "COS 343",
    name: "Advanced Database Concepts"
  }
];

module.exports = {
  Query: {
    courseCount: () => courses.length,
    courses: (_, __, { dataSources }) => dataSources.psql.allCourses()
  }
};

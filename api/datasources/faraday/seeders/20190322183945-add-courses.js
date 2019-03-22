"use strict";

module.exports = {
  up: queryInterface => {
    return queryInterface.bulkInsert(
      "Courses",
      [
        {
          number: "COS 243",
          title: "Multi-tier Web Application Development",
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          number: "COS 343",
          title: "Advanced Database Concepts",
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ],
      {}
    );
  },

  down: queryInterface => {
    return queryInterface.bulkDelete("Users", null, {});
  }
};

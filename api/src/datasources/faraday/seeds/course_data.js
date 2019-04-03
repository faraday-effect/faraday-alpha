const Course = require("../models/Course");

exports.seed = async function(knex) {
  await knex("courses").del();

  await Course.query(knex).insertGraph([
    {
      number: "243",
      title: "Multi-tier Web Application Development",
      prefix: { "#id": "cos-prefix", value: "COS" },
      department: {
        "#id": "cse-department",
        name: "Computer Science & Engineering"
      }
    },
    {
      number: "343",
      title: "Advanced Database Concepts",
      prefix: { "#ref": "cos-prefix" },
      department: { "#ref": "cse-department" }
    }
  ]);
};

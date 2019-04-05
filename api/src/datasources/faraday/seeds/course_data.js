const Course = require("../models/Course");

exports.seed = async function(knex) {
  await knex("courses").del();
  await knex("prefixes").del();
  await knex("departments").del();

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
    },
    {
      number: "101",
      title: "Introduction to Systems",
      prefix: { "#id": "sys-prefix", value: "SYS" },
      department: { "#ref": "cse-department" }
    },
    {
      number: "151",
      title: "Calculus I",
      prefix: { "#id": "mat-prefix", value: "MAT" },
      department: { "#id": "math-department", name: "Mathematics" }
    },
    {
      number: "211",
      title: "Introduction to Systems",
      prefix: { "#id": "phy-prefix", value: "PHY" },
      department: { "#id": "physics-department", name: "Physics & Engineering" }
    }
  ]);
};

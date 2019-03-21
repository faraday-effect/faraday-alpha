const SQL = require("sequelize");

module.exports = () => {
  const db = new SQL("postgres://faraday:password@localhost:5432/faraday");

  const Course = db.define("course", {
    id: {
      type: SQL.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    code: SQL.STRING,
    name: SQL.STRING
  });

  const Semester = db.define("semester", {
    name: SQL.STRING
  })

  return { Course, Semester };
};

// Course.sync();
//
// Course.create({
//   code: "COS 243",
//   name: "Multi-tier Web Application Development"
// });
// Course.create({
//   code: "COS 343",
//   name: "Advanced Database Concepts"
// });
//
// module.exports = { Course };

const { Model } = require("objection");

class Course extends Model {
  static get tableName() {
    return "courses";
  }
}

module.exports = Course;

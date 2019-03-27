const { Model } = require("objection");

class Course extends Model {
  static getTableName() {
    return "courses";
  }
}

module.exports = Course;

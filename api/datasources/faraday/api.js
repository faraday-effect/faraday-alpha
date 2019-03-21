// N.B., it's fine to return a promise from a data source function.

const { DataSource } = require("apollo-datasource");

class FaradayAPI extends DataSource {
  constructor(models) {
    super();
    this.models = models;
    this.context = null;
  }

  initialize(config) {
    this.context = config.context;
  }

  allCourses() {
    return this.models.Course.findAll();
  }

  countCourses() {
    return this.models.Course.count();
  }

  addCourse(args) {
    return this.models.Course.create(args);
  }
}

module.exports = FaradayAPI;

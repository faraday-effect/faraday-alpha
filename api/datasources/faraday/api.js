// N.B., it's fine to return a promise from a data source function.

const { AuthenticationError } = require("apollo-server-express");
const { DataSource } = require("apollo-datasource");

class FaradayAPI extends DataSource {
  constructor() {
    super();
    this.models = require("./models");
  }

  initialize(config) {
    this.context = config.context;
  }

  // --- User

  createUser(email, password) {
    return this.models.User.query().insert({ email, password });
  }

  userById(id) {
    return this.models.User.query().findById(id);
  }

  allUsers() {
    return this.models.User.query();
  }

  async authenticateUser(email, password) {
    const user = await this.models.User.query().findOne({ email });

    if (!user) {
      throw new AuthenticationError("Invalid credentials");
    }

    const valid = user.validatePassword(password);

    if (!valid) {
      throw new AuthenticationError("Invalid credentials");
    }

    return user;
  }

  // --- Course

  createCourse(number, title) {
    return this.models.Course.query().insert({ number, title });
  }

  courseById(id) {
    return this.models.Course.query().findById(id);
  }

  allCourses() {
    return this.models.Course.query();
  }
}

module.exports = FaradayAPI;

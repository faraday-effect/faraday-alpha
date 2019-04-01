// N.B., it's fine to return a promise from a data source function.

const { AuthenticationError, UserInputError } = require("apollo-server-express");
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

  /**
   * Create a new user.
   * @param email - email address
   * @param password - plain text password
   * @returns {*} new user with ID and encrypted password.
   */
  async createUser(email, password) {
    if (!email) {
      throw new UserInputError("Email address can't be empty");
    }

    if (!password) {
      throw new UserInputError("Password can't be empty");
    }

    // TODO - Replace this lame regex with the `isemail` package or equivalent;
    //        wasn't able to install it when I wrote this code (network error).
    if (!/^[\w.-]+@[\w-]+\.[\w]{2,}$/.test(email)){
      throw new UserInputError(("Email address is invalid"));
    }

    const checkUser = await this.models.User.query().findOne({ email });

    if (checkUser) {
      throw new AuthenticationError("Email already in use");
    }

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

    const valid = await user.validatePassword(password);

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

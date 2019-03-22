// N.B., it's fine to return a promise from a data source function.

const { DataSource } = require("apollo-datasource");
const bcrypt = require("bcrypt");
const jsonwebtoken = require("jsonwebtoken");
require("dotenv").config();

class FaradayAPI extends DataSource {
  constructor() {
    super();
    this.db = require("./models");
    this.context = null;
  }

  initialize(config) {
    this.context = config.context;
  }

  allCourses() {
    return this.db.Course.findAll();
  }

  countCourses() {
    return this.db.Course.count();
  }

  addCourse(args) {
    return this.db.Course.create(args);
  }

  me(args, user) {
    if (!user) {
      throw new Error("Not logged in");
    }
    return this.db.User.findByPk(user.id);
  }

  async signUp(username, email, password) {
    const user = await this.db.User.create({
      username,
      email,
      password: await bcrypt.hash(password, 10)
    });

    return jsonwebtoken.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1y" }
    );
  }

  async login(email, password) {
    const user = await this.db.User.findOne({ where: { email } });

    if (!user) {
      throw new Error("Invalid user");
    }

    const valid = await bcrypt.compare(password, user.password);

    if (!valid) {
      throw new Error("Bogus password");
    }

    return jsonwebtoken.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
  }

  allUsers() {
    return this.db.User.findAll();
  }
}

module.exports = FaradayAPI;

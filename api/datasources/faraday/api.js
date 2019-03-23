// N.B., it's fine to return a promise from a data source function.

const { DataSource } = require("apollo-datasource");
const bcrypt = require("bcrypt");
const jsonwebtoken = require("jsonwebtoken");
require("dotenv").config();

const Knex = require("knex");
const knexfile = require("./knexfile");
const knex = Knex(knexfile["development"]);

const { Model } = require("objection");
Model.knex(knex);

const Course = require("./models/Course");
const User = require("./models/User");

class FaradayAPI extends DataSource {
  initialize(config) {
    this.context = config.context;
  }

  allCourses() {
    return Course.query();
  }

  countCourses() {
    return knex("courses")
      .count()
      .first()
      .then(result => result.count);
  }

  addCourse(args) {
    return Course.query().insert(args);
  }

  me(args, user) {
    if (!user) {
      throw new Error("Not logged in");
    }
    return User.findById(user.id);
  }

  async signUp(username, email, password) {
    const user = await User.query().insert({
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
    const user = await User.query().where({ email });

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
    return User.query();
  }
}

module.exports = FaradayAPI;

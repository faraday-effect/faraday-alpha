require("dotenv").config();

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const SALT_ROUNDS = 12;

const { Model } = require("objection");
const { MEDIUM_STRING, LONG_STRING } = require("./validators");

class User extends Model {
  static get tableName() {
    return "users";
  }

  /**
   * From the documentation, this is the "schema against which the
   * JSON is validated ... each time a Model instance is created."
   *
   * I _think_ that means we shouldn't include the `id` field,
   * which is generated by the database.
   */
  static get jsonSchema() {
    return {
      type: "object",
      properties: {
        email: { type: "string", format: "email" },
        password: MEDIUM_STRING,
        firstName: LONG_STRING,
        lastName: LONG_STRING,
        officePhone: MEDIUM_STRING,
        mobilePhone: MEDIUM_STRING
      },
      required: ["email", "password", "firstName", "lastName"],
      additionalProperties: false
    };
  }

  async encryptPassword() {
    this.password = await bcrypt.hash(this.password, SALT_ROUNDS);
  }

  async validatePassword(password) {
    const valid = await bcrypt.compare(password, this.password);
    return valid;
  }

  /**
   * Create a JSON Web Token for a user
   * @param expiresIn - duration of JWT
   * @returns {String) containing JWT
   */
  async createToken(expiresIn = "1d") {
    return await jwt.sign(
      {
        id: this.id,
        email: this.email
      },
      process.env.JWT_SECRET,
      {
        expiresIn
      }
    );
  }

  async $beforeInsert() {
    await this.encryptPassword();
  }

  async $beforeUpdate() {
    await this.encryptPassword();
  }
}

module.exports = User;

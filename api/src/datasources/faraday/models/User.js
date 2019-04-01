require("dotenv").config();

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const SALT_ROUNDS = 12;

const { Model } = require("objection");

class User extends Model {
  static get tableName() {
    return "users";
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

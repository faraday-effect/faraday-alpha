require("dotenv").config();

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

  validatePassword(password) {
    return bcrypt.compare(password, this.password);
  }

  async $beforeInsert() {
    await this.encryptPassword();
  }

  async $beforeUpdate() {
    await this.encryptPassword();
  }
}

module.exports = User;

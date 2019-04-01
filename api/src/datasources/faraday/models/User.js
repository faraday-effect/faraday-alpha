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

  async validatePassword(password) {
    const valid = await bcrypt.compare(password, this.password);
    return valid;
  }

  async $beforeInsert() {
    await this.encryptPassword();
  }

  async $beforeUpdate() {
    await this.encryptPassword();
  }
}

module.exports = User;

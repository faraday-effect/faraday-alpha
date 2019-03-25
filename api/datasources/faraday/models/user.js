const { Model } = require("objection");

class User extends Model {
  static getTableName() {
    return "users";
    }
}

module.exports = User;

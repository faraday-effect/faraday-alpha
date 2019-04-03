const { Model } = require("objection");

const { LONG_STRING } = require("./validators");

class Department extends Model {
  static get tableName() {
    return "departments";
  }

  static get relationMappings() {
    return {};
  }

  static get jsonSchema() {
    return {
      type: "object",
      properties: {
        name: LONG_STRING
      },
      required: ["name"],
      additionalProperties: false
    };
  }
}

module.exports = Department;

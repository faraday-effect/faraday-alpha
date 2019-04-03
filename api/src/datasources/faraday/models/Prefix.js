const { Model } = require("objection");

const { MEDIUM_STRING } = require("./validators");

class Prefix extends Model {
  static get tableName() {
    return "prefixes";
  }

  static get relationMappings() {
    return {};
  }

  static get jsonSchema() {
    return {
      type: "object",
      properties: {
        value: MEDIUM_STRING
      },
      required: ["value"],
      additionalProperties: false
    };
  }
}

module.exports = Prefix;

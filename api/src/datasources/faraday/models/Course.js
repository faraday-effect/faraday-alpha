const { Model } = require("objection");

const { SHORT_STRING, LONG_STRING } = require("./validators");

class Course extends Model {
  static get tableName() {
    return "courses";
  }

  static get jsonSchema() {
    return {
      type: "object",
      properties: {
        id: { type: "integer" },
        number: SHORT_STRING,
        title: LONG_STRING
      },
      required: ["number", "title"],
      additionalProperties: false
    };
  }
}

module.exports = Course;

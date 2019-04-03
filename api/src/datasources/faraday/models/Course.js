const { Model } = require("objection");

const { ID, SHORT_STRING, LONG_STRING } = require("./validators");

class Course extends Model {
  static get tableName() {
    return "courses";
  }

  static get relationMappings() {
    const Prefix = require("./Prefix");
    const Department = require("./Department");

    return {
      prefix: {
        relation: Model.BelongsToOneRelation,
        modelClass: Prefix,
        join: {
          from: "courses.prefix_id",
          to: "prefixes.id"
        }
      },
      department: {
        relation: Model.BelongsToOneRelation,
        modelClass: Department,
        join: {
          from: "courses.department_id",
          to: "departments.id"
        }
      }
    };
  }

  static get jsonSchema() {
    return {
      type: "object",
      properties: {
        number: SHORT_STRING,
        title: LONG_STRING,
        prefix_id: ID,
        department_id: ID
      },
      required: ["number", "title", "prefix_id", "department_id"],
      additionalProperties: false
    };
  }
}

module.exports = Course;

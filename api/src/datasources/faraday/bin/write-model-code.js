#!/usr/bin/env node

const debug = require("debug")("model-code");

const fs = require("fs");
const path = require("path");

const _ = require("lodash");
const yaml = require("js-yaml");
const toposort = require("toposort");
const prettier = require("prettier");
const { capitalize, pluralize, singularize } = require("inflection");
const Handlebars = require("handlebars");
const Ajv = require("ajv");

// ---- Handlebars templates

const readTemplate = template =>
  Handlebars.compile(fs.readFileSync(path.join(__dirname, template), "utf-8"));

const modelTemplate = readTemplate("./model-template.js.hbs");
const belongsToOneTemplate = readTemplate("./belongs-to-one.js.hbs");
const hasManyTemplate = readTemplate("./has-many.js.hbs");

// ---- Handy functions

const isSingular = word => singularize(word) === word;

// ---- Entities

class Column {
  constructor(column) {
    this.name = column.name;
    this.type = column.type;
    this.options = column.options || [];
  }

  asKnexDecl() {
    const segments = ["table"];

    // Type and name
    let type = null;
    if (this.name.endsWith("_id")) {
      type = "integer";
    } else if (this.type.endsWith("-string")) {
      type = "string";
    } else {
      type = this.type;
    }
    segments.push(`${type}("${this.name}")`);

    // Options
    for (let option of this.options) {
      if (option === "required") {
        segments.push("notNullable()");
      } else if (option === "unique") {
        segments.push("unique()");
      } else {
        segments.push(option);
      }
    }

    return segments.join(".") + ";";
  }
}

class Table {
  constructor(entity) {
    if (isSingular(entity.name)) {
      throw new Error(`Table name "${entity.name}" should be plural`);
    }

    this.name = entity.name;
    this.columns = _.map(entity.columns, col => new Column(col));
    this.relatedTableNames = [];
    this.importedModelNames = [];
    this.relationMappings = [];
  }

  addRelatedTable(tableName, fkCol) {
    this.relatedTableNames.push(tableName);
    this.columns.push(fkCol);
  }

  addRelationMapping(tableName, mapping) {
    this.importedModelNames.push(tableName);
    this.relationMappings.push(mapping);
  }

  requiredColumnNamesQuoted() {
    return _.map(
      _.filter(this.columns, column => column.options.includes("required")),
      col => `"${col.name}"`
    );
  }

  // EG: column type "long-string" in YAML becomes LONG_STRING.
  applyValidators() {
    const validators = new Set();

    for (let column of this.columns) {
      let validator = null;

      if (column.name.endsWith("_id")) {
        validator = "ID";
      } else if (column.type.match(/-string$/)) {
        validator = column.type.toUpperCase().replace("-", "_");
      }
      column.type = validator;
      validators.add(validator);
    }

    return Array.from(validators);
  }

  relatedModelImports() {
    return _.map(this.importedModelNames, tableName => {
      const modelName = capitalize(singularize(tableName));
      return `const ${modelName} = require("./${modelName}");`;
    }).join("\n");
  }

  asKnexCreateTable() {
    const deps = this.relatedTableNames.length
      ? `\n// Dependencies: ${this.relatedTableNames.join(", ")}`
      : "";

    return `
    ${deps}
    await knex.schema.createTable("${this.name}", table => {
    table.increments();
    ${this.columns.map(column => column.asKnexDecl()).join("\n")}
    });`;
  }

  asKnexDropTable() {
    return `await knex.schema.dropTable("${this.name}");`;
  }

  asObjectionModel() {
    return modelTemplate({
      tableName: this.name,
      modelName: capitalize(singularize(this.name)),
      relatedModels: this.relatedModelImports(),
      relationMappings: this.relationMappings,
      requiredProperties: this.requiredColumnNamesQuoted(),
      validators: this.applyValidators()
        .sort()
        .join(","),
      properties: _.map(this.columns, col => `${col.name}: ${col.type}`).join(
        ","
      )
    });
  }
}

class Tables {
  constructor() {
    this.tableByName = {};
  }

  addTable(table) {
    if (table.name in this.tableByName) {
      throw new Error("Duplicate table: '${table.name}'");
    }
    this.tableByName[table.name] = table;
  }

  findTable(name) {
    return this.tableByName[name];
  }

  asKnexMigration() {
    // Nodes are table names, edges are table dependencies.
    const allNodes = _.keys(this.tableByName);
    const allEdges = _.reduce(
      _.map(this.tableByName, table =>
        _.map(table.relatedTableNames, related => [table.name, related])
      ),
      (accumulator, more) => accumulator.concat(more),
      []
    );

    const dropOrder = toposort.array(allNodes, allEdges);
    const createOrder = [...dropOrder].reverse();

    debug("NAMES %O", allNodes);
    debug("EDGES %O", allEdges);
    debug("DROP %O", dropOrder);
    debug("CREATE %O", createOrder);

    const upMethod = `exports.up = async function(knex) {
      // Create partial order: ${createOrder.join(", ")}
      ${createOrder
        .map(tableName => this.tableByName[tableName].asKnexCreateTable())
        .join("\n")}
      };\n`;

    const downMethod = `exports.down = async function(knex) {
      ${dropOrder
        .map(tableName => this.tableByName[tableName].asKnexDropTable())
        .join("\n")}
      };`;

    return [upMethod, downMethod].join("\n");
  }

  asObjectionModels() {
    return _.map(_.values(this.tableByName), table =>
      table.asObjectionModel()
    ).join("\n");
  }
}

// Poor man's static properties alternative.
const AllTables = new Tables();
Object.freeze(AllTables);

// ---- Relationships

class OneToManyRelationship {
  constructor(rel) {
    // The "one" side (e.g., "one department")
    this.oneTable = pluralize(rel.one);
    this.oneModel = capitalize(rel.one);
    this.oneRel = rel.many;
    this.onePK = `${this.oneTable}.id`;

    // The "many" side (e.g., "has many courses")
    this.manyTable = rel.many;
    this.manyModel = capitalize(singularize(rel.many));
    this.manyRel = rel.one;
    this.manyFK = `${rel.one}_id`;

    // Other
    this.required = !!(rel.options && rel.options.includes("required"));
  }

  injectKnexForeignKey() {
    const options = [];

    if (this.required) {
      options.push("required");
    }
    options.push(`references("${this.onePK}")`);

    AllTables.findTable(this.manyTable).addRelatedTable(
      this.oneTable,
      new Column({
        name: this.manyFK,
        type: "integer",
        options
      })
    );
  }

  injectObjectionRelationMappings() {
    AllTables.findTable(this.manyTable).addRelationMapping(
      this.oneTable,
      belongsToOneTemplate({
        relName: this.manyRel,
        modelClass: this.oneModel,
        fromCol: `${this.manyTable}.${this.manyFK}`,
        toCol: this.onePK
      })
    );

    AllTables.findTable(this.oneTable).addRelationMapping(
      this.manyTable,
      hasManyTemplate({
        relName: this.oneRel,
        modelClass: this.manyModel,
        fromCol: `${this.manyTable}.${this.manyFK}`,
        toCol: `${this.oneTable}.id`
      })
    );
  }
}

class Relationships {
  constructor(relationships) {
    const all = [];

    for (let rel of relationships) {
      all.push(rel);
      switch (rel.type) {
        case "one-to-many":
          {
            const relObj = new OneToManyRelationship(rel);
            relObj.injectKnexForeignKey();
            relObj.injectObjectionRelationMappings();
          }
          break;

        case "many-to-many":
          throw new Error("Implement me");

        default:
          throw new Error("Invalid relationship type: '${rel.type}'");
      }
    }

    return all;
  }
}

function prettyOutput(code) {
  // debug("RAW CODE %s", code);
  console.log(prettier.format(code, { parser: "babel" }));
}

try {
  const doc = yaml.safeLoad(fs.readFileSync(process.argv[2], "utf-8"));

  const ajv = new Ajv();
  const schema = yaml.safeLoad(
    fs.readFileSync(path.join(__dirname, "model-schema.yaml"))
  );
  debug("SCHEMA %O", schema);

  const validate = ajv.compile(schema);
  if (!validate(doc)) {
    console.log("INVALID FILE", JSON.stringify(validate.errors, null, 2));
    process.exit(1);
  }

  _.forEach(doc.entities, entity => AllTables.addTable(new Table(entity)));
  debug("ENTITIES %O", AllTables);

  const relationships = new Relationships(doc.relationships);
  debug("RELATIONSHIPS %O", relationships);

  prettyOutput(AllTables.asKnexMigration());
  prettyOutput(AllTables.asObjectionModels());
} catch (err) {
  console.error("ERROR", err);
}

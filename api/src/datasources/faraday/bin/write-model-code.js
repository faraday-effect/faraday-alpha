#!/usr/bin/env node

const yaml = require("js-yaml");
const fs = require("fs");
const path = require("path");
const toposort = require("toposort");
const _ = require("lodash");
const prettier = require("prettier");
const { capitalize, pluralize, singularize } = require("inflection");
const Handlebars = require("handlebars");

// ---- Handlebars templates

const readTemplate = template =>
  Handlebars.compile(fs.readFileSync(path.join(__dirname, template), "utf-8"));

const modelTemplate = readTemplate("./model-template.js.hbs");
const belongsToOneTemplate = readTemplate("./belongs-to-one.js.hbs");
const hasManyTemplate = readTemplate("./has-many.js.hbs");

// ---- Entities

class Column {
  constructor(column) {
    this.name = column.name;
    this.type = column.type;
    this.options = column.options || [];
  }

  asKnexDecl() {
    const segments = ["table"];

    // Type
    if (this.name.endsWith("_id")) {
      segments.push("integer");
    } else if (name.type.endsWith("-string")) {
      segments.push("string");
    } else {
      segments.push(this.type);
    }

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
    this.name = entity.name;
    this.columns = _.map(entity.columns, col => new Column(col));
    this.relatedTables = [];
  }

  addColumn(col) {
    this.columns.push(col);
  }

  asKnexCreateTable() {
    return `
    // Dependencies: ${this.relatedTables.join(", ")}
    await knex.schema.createTable("${this.name}", table => {
    table.increments();
    ${this.columns.map(column => column.asKnexDecl()).join("\n")}
    });`;
  }

  asKnexDropTable() {
    return `await knex.schema.dropTable("${this.name}");`;
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
}

const AllTables = new Tables();
Object.freeze(AllTables);

// ---- Relationships

// const relationships = {};
// const tableDependsOn = [];
//
// function addRelationship(tableName, details) {
//   if (tableName in relationships === false) {
//     relationships[tableName] = [];
//   }
//   relationships[tableName].push(details);
//
//   if (details.relatedTable) {
//     tableDependsOn.push([tableName, details.relatedTable]);
//   }
// }
//
// const haveRelatedTable = table =>
//   table.name in relationships && relationships[table.name].relatedTable;
//
// const getRelations = table =>
//   table.name in relationships ? relationships[table.name] : [];
//
// function printRelationships() {
//   _.forEach(relationships, (details, tableName) =>
//     _.forEach(details, d =>
//       console.log(
//         `[${tableName}] ${d.relatedTable} ${d.foreignKey} ${d.required}\n${
//           d.relation
//         }`
//       )
//     )
//   );
// }

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

    AllTables.findTable(this.manyTable).addColumn(
      new Column({
        name: this.manyFK,
        type: "integer",
        options
      })
    );
  }

  asModelManySide() {
    belongsToOneTemplate({
      relName: this.manyRel,
      modelClass: this.oneModel,
      fromCol: `${this.manyTable}.${this.manyFK}`,
      toCol: this.onePK
    });
  }

  asModelOneSide() {
    hasManyTemplate({
      relName: this.oneRel,
      modelClass: this.manyModel,
      fromCol: `${this.manyTable}.${this.manyFK}`,
      toCol: `${this.oneTable}.id`
    });
  }
}

class Relationships {
  constructor(relationships) {
    this.relationships = relationships;

    for (let rel of this.relationships) {
      switch (rel.type) {
        case "one-to-many":
          {
            const relObj = new OneToManyRelationship(rel);
            relObj.injectKnexForeignKey();
          }
          break;

        default:
          throw new Error("Invalid relationship type: '${rel.type}'");
      }
    }
  }
}

// function buildRelationships(doc) {
//   for (let rel of doc.relationships) {
//     switch (rel.type) {
//       case "one-to-many":
//         {
//           // The "one" side (e.g., "one department")
//           const oneTable = pluralize(rel.one);
//           const oneModel = capitalize(rel.one);
//           const oneRel = rel.many;
//           const onePK = `${oneTable}.id`;
//
//           // The "many" side (e.g., "has many courses")
//           const manyTable = rel.many;
//           const manyModel = capitalize(singularize(rel.many));
//           const manyRel = rel.one;
//           const manyFK = `${rel.one}_id`;
//
//           // Source model is "many" side (e.g., courses).
//           addRelationship(manyTable, {
//             relatedTable: {
//               name: oneTable,
//               primaryKey: onePK,
//               foreignKey: manyFK,
//               required: !!(rel.options && rel.options.includes("required"))
//             },
//             relation: belongsToOneTemplate({
//               relName: manyRel,
//               modelClass: oneModel,
//               fromCol: `${manyTable}.${manyFK}`,
//               toCol: onePK
//             })
//           });
//
//           // Source model is "one" side (e.g., department)
//           addRelationship(oneTable, {
//             relatedTable: null,
//             relation: hasManyTemplate({
//               relName: oneRel,
//               modelClass: manyModel,
//               fromCol: `${manyTable}.${manyFK}`,
//               toCol: `${oneTable}.id`
//             })
//           });
//         }
//         break;
//
//       case "many-to-many":
//         break;
//
//       default:
//         throw new Error("Invalid relationship type: '${rel.type}'");
//     }
//   }
//
//   // printRelationships();
// }

// ---- Knex

// function injectRelationColumns(table) {
//   _.forEach(getRelations(table), details => {
//     const options = [];
//     const relatedTable = details.relatedTable;
//
//     if (relatedTable) {
//       if (relatedTable.required) {
//         options.push("required");
//       }
//
//       options.push(`references("${relatedTable.foreignKey}")`);
//
//       table.columns.push({
//         name: details.relatedTable.foreignKey,
//         type: "integer",
//         options
//       });
//     }
//   });
// }

function prettyOutput(code) {
  console.log(prettier.format(code, { parser: "babel" }));
}

function outputKnexSchema(doc) {
  let tableInfo = {};

  for (let table of doc.entities) {
    injectRelationColumns(table);
    tableInfo[table.name] = {
      createTable: knexCreateTable(table),
      dropTable: knexDropTable(table)
    };
  }

  const allTables = _.keys(tableInfo);
  const dropOrder = toposort.array(allTables, tableDependsOn);
  const createOrder = [...dropOrder].reverse();

  prettyOutput(
    `exports.up = async function(knex) {
    // Create order: ${createOrder.join(", ")}
    ${createOrder.map(tableName => tableInfo[tableName].createTable).join("\n")}
    };\n`
  );

  prettyOutput(`exports.down = async function(knex) {
    ${dropOrder.map(tableName => tableInfo[tableName].dropTable).join("\n")}
    };`);
}

// ---- Objection Models

function findRelationMappings(table) {
  const mappings = {};
  for (let column of table.columns) {
    if ("relation" in column) {
      mappings[column.name] = column;
    }
  }
  return mappings;
}

function modelName(table) {
  return capitalize(singularize(table.name));
}

function findRequiredColumns(table) {
  return _.map(
    _.filter(
      table.columns,
      col => col.options && col.options.includes("required")
    ),
    col => col.name
  );
}

function mapColumnTypes(table) {
  const validators = new Set();

  for (let column of table.columns) {
    let validator = null;

    if (column.name.endsWith("_id")) {
      validator = "ID";
      column.type = validator;
    } else if (column.type.match(/-string$/)) {
      validator = column.type.toUpperCase().replace("-", "_");
      column.type = validator;
    }

    validators.add(validator);
  }

  return Array.from(validators);
}

const schemaProperties = columns =>
  _.map(columns, col => `${col.name}: ${col.type}`).join(",");

const quoteAndJoin = values => _.map(values, prop => `"${prop}"`).join(", ");

function outputObjectionModels(doc) {
  let tableInfo = {};

  for (let table of doc.entities) {
    tableInfo[table.name] = {
      tableName: table.name,
      modelName: modelName(table),
      relations: findRelationMappings(table),
      required: findRequiredColumns(table),
      validators: mapColumnTypes(table),
      properties: schemaProperties(table.columns)
    };
  }

  _.forEach(tableInfo, info => {
    console.log("TABLE INFO", JSON.stringify(info, null, 2));
    prettyOutput(
      modelTemplate({
        tableName: info.tableName,
        modelName: info.modelName,
        relations: info.relations,
        requiredProperties: quoteAndJoin(info.required),
        validators: info.validators.sort().join(", "),
        properties: info.properties
      })
    );
  });
}

try {
  const doc = yaml.safeLoad(fs.readFileSync(process.argv[2], "utf-8"));

  _.forEach(doc.entities, entity => AllTables.addTable(new Table(entity)));
  const relationships = new Relationships(doc.relationships);

  console.log(JSON.stringify(relationships, null, 2));
  console.log(JSON.stringify(AllTables, null, 2));

  // outputKnexSchema(doc);
  // outputObjectionModels(doc);
} catch (err) {
  console.error("ERROR", err);
}

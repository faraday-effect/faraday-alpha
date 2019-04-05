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

// ---- Relationships

// if (createOrder.length) {
//   console.log("// Dependencies:");
//   _.map(tableInfo, (info, name) => {
//     if (info.relationships.length) {
//       console.log(
//         `//   ${name} => ${_.map(info.relationships, entry => entry[1]).join(
//           ", "
//         )}`
//       );
//     }
//   });
//   console.log(`// Create order: ${createOrder.join(", ")}`);
// }

const relationships = {};
const tableDependsOn = [];

function addRelationship(tableName, details) {
  if (tableName in relationships === false) {
    relationships[tableName] = [];
  }
  relationships[tableName].push(details);

  if (details.relatedTable) {
    tableDependsOn.push([tableName, details.relatedTable]);
  }
}

const getRelations = table =>
  table.name in relationships ? relationships[table.name] : [];

function printRelationships() {
  _.forEach(relationships, (details, tableName) =>
    _.forEach(details, d =>
      console.log(
        `[${tableName}] ${d.relatedTable} ${d.foreignKey} ${d.required}\n${
          d.relation
        }`
      )
    )
  );
}

function buildRelationships(doc) {
  for (let rel of doc.relationships) {
    switch (rel.type) {
      case "one-to-many":
        {
          // The "one" side (e.g., "one department")
          const oneTable = pluralize(rel.one);
          const oneModel = capitalize(rel.one);
          const oneRel = rel.many;
          const onePK = `${oneTable}.id`;

          // The "many" side (e.g., "has many courses")
          const manyTable = rel.many;
          const manyModel = capitalize(singularize(rel.many));
          const manyRel = rel.one;
          const manyFK = `${rel.one}_id`;

          // Source model is "many" side (e.g., courses).
          addRelationship(manyTable, {
            relatedTable: oneTable,
            foreignKey: manyFK,
            referenced: onePK,
            required: !!(rel.options && rel.options.includes("required")),
            relation: belongsToOneTemplate({
              relName: manyRel,
              modelClass: oneModel,
              fromCol: `${manyTable}.${manyFK}`,
              toCol: onePK
            })
          });

          // Source model is "one" side (e.g., department)
          addRelationship(oneTable, {
            relatedTable: null,
            foreignKey: null,
            referenced: null,
            required: false,
            relation: hasManyTemplate({
              relName: oneRel,
              modelClass: manyModel,
              fromCol: `${manyTable}.${manyFK}`,
              toCol: `${oneTable}.id`
            })
          });
        }
        break;

      case "many-to-many":
        break;

      default:
        throw new Error("Invalid relationship type: '${rel.type}'");
    }
  }

  printRelationships();
}

// ---- Knex

function knexColumnType({ name, type }) {
  if (name.endsWith("_id")) {
    return "integer";
  } else if (type.endsWith("-string")) {
    return "string";
  }
  return type;
}

function knexColumnOptions({ options }) {
  let rtn = [];

  if (options) {
    for (let option of options) {
      if (option === "required") {
        rtn.push("notNullable()");
      } else if (option === "unique") {
        rtn.push("unique()");
      } else {
        rtn.push(option);
      }
    }
  }

  return rtn;
}

const knexColumn = column =>
  [
    "table",
    `${knexColumnType(column)}("${column.name}")`,
    ...knexColumnOptions(column)
  ].join(".") + ";";

function injectRelationColumns(table) {
  _.forEach(getRelations(table), details => {
    const options = [];

    if (details.required) {
      options.push("required");
    }

    if (details.referenced) {
      options.push(`references("${details.referenced}")`);
    }

    if (details.foreignKey) {
      table.columns.push({
        name: details.foreignKey,
        type: "integer",
        options
      });
    }
  });
}

const knexCreateTable = table =>
  `await knex.schema.createTable("${table.name}", table => {
    table.increments();
    ${table.columns.map(column => knexColumn(column)).join("\n")}
  });`;

const knexDropTable = table => `await knex.schema.dropTable("${table.name}");`;

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
  buildRelationships(doc);
  outputKnexSchema(doc);
  outputObjectionModels(doc);
} catch (err) {
  console.error("ERROR", err);
}

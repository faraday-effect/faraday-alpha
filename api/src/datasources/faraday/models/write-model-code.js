const yaml = require("js-yaml");
const fs = require("fs");
const toposort = require("toposort");
const _ = require("lodash");

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
    if (options.includes("not-null")) {
      rtn.push("notNullable()");
    }
    if (options.includes("unique")) {
      rtn.push("unique()");
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

const knexCreateTable = table =>
  `await knex.schema.createTable("${table.name}", table => {
    table.increments();
    ${table.columns.map(column => knexColumn(column)).join("\n")}
  });`;

const knexDropTable = table => `await knex.schema.dropTable("${table.name}");`;

function findRelationships(table) {
  let refersTo = [];
  for (let column of table.columns) {
    if ("relation" in column) {
      refersTo.push([table.name, column.relation.to]);
    }
  }
  return refersTo;
}

function convert(doc) {
  let tableInfo = {};

  for (let table of doc) {
    tableInfo[table.name] = {
      relationships: findRelationships(table),
      createTable: knexCreateTable(table),
      dropTable: knexDropTable(table)
    };
  }

  const refersTo = _.flatten(_.map(tableInfo, info => info.relationships));
  console.log(refersTo);
  console.log(toposort(refersTo));

  // console.log(`exports.up = async function(knex) {
  //   ${doc.map().join("\n\n")}
  //   };\n`);
  //
  // console.log(`exports.down = async function(knex) {
  //   ${doc.map(table => knexDropTable(table)).join("\n")}
  //   };`);
}

try {
  const doc = yaml.safeLoad(fs.readFileSync("./models.yaml", "utf-8"));
  convert(doc);
} catch (err) {
  console.error("ERROR", err);
}

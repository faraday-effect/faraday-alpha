#!/usr/bin/env node

const yaml = require("js-yaml");
const fs = require("fs");
const toposort = require("toposort");
const _ = require("lodash");
const prettier = require("prettier");

function knexColumnType({ name, type }) {
  if (name.endsWith("_id")) {
    return "integer";
  } else if (type.endsWith("-string")) {
    return "string";
  }
  return type;
}

function knexColumnOptions({ options, relation }) {
  let rtn = [];

  if (options) {
    if (options.includes("not-null")) {
      rtn.push("notNullable()");
    }
    if (options.includes("unique")) {
      rtn.push("unique()");
    }
  }

  if (relation) {
    if (relation.type === "many-to-one") {
      rtn.push(`references("${relation.to}.id")`);
    } else {
      throw new Error("Invalid relation type '${relation}'");
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

function prettyOutput(code) {
  console.log(prettier.format(code, { parser: "babel" }));
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

  const allTables = _.keys(tableInfo);
  const refersTo = _.flatten(_.map(tableInfo, info => info.relationships));
  const dropOrder = toposort.array(allTables, refersTo);
  const createOrder = [...dropOrder].reverse();

  prettyOutput(
    `exports.up = async function(knex) {
    ${createOrder.map(tableName => tableInfo[tableName].createTable).join("\n")}
    };\n`,
    { parser: "babel" }
  );

  prettyOutput(`exports.down = async function(knex) {
    ${dropOrder.map(tableName => tableInfo[tableName].dropTable).join("\n")}
    };`);
}

try {
  const doc = yaml.safeLoad(fs.readFileSync(process.argv[2], "utf-8"));
  convert(doc);
} catch (err) {
  console.error("ERROR", err);
}

#!/usr/bin/env node

import createDebug = require("debug");
const debug = createDebug("model-code");

import fs = require("fs");
import path = require("path");

import yargs = require("yargs");
import _ = require("lodash");
import yaml = require("js-yaml");

import toposort = require("toposort");
import prettier = require("prettier");
import { capitalize, pluralize, singularize } from "inflection";

import Handlebars = require("handlebars");
import Ajv = require("ajv");

// ---- Handlebars templates

class TemplateEngine {
  private static compiledTemplates: Map<string, any> = new Map();

  public constructor(private baseDir: string) {}

  public renderTemplate(name: string, context: object) {
    if (!TemplateEngine.compiledTemplates.has(name)) {
      const source = fs.readFileSync(path.join(this.baseDir, name), "utf-8");
      const template = Handlebars.compile(source);
      TemplateEngine.compiledTemplates.set(name, template);
    }

    const template = TemplateEngine.compiledTemplates.get(name);
    return template(context);
  }
}

// ---- Handy functions

const isSingular = (word: string) => singularize(word) === word;

// ---- Entities

interface ColumnDef {
  name: string;
  type: string;
  options: string[];
}

interface ValidatorDetails {
  isSpecial: boolean;
  validator: string;
}

class Column {
  public constructor(
    public readonly name: string,
    public readonly type: string,
    public readonly options: string[] = []
  ) {}

  public hasOption(option: string) {
    return this.options.includes(option);
  }

  public asKnexDecl() {
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

  public getValidatorDetails(): ValidatorDetails {
    if (this.name.endsWith("_id")) {
      // Foreign key
      return {
        isSpecial: true,
        validator: "ID"
      };
    } else if (this.type.match(/-string$/)) {
      // String type
      return {
        isSpecial: true,
        validator: this.type.toUpperCase().replace("-", "_")
      };
    } else {
      // Ordinary column.
      return {
        isSpecial: false,
        validator: JSON.stringify({ type: this.type })
      };
    }
  }
}

interface TableDef {
  name: string;
  columns: ColumnDef[];
}

class Table {
  public readonly name: string;
  public readonly columns: Column[];
  private readonly relatedTableNames: string[];
  private importedModelNames: string[];
  private readonly relationMappings: string[];

  public constructor(private engine: TemplateEngine, tableDef: TableDef) {
    const { name, columns } = tableDef;

    if (isSingular(name)) {
      throw new Error(`Table name "${name}" should be plural`);
    }

    this.name = name;
    this.columns = _.map(
      columns,
      (column: ColumnDef) =>
        new Column(column.name, column.type, column.options)
    );
    this.relatedTableNames = [];
    this.importedModelNames = [];
    this.relationMappings = [];
  }

  public addRelatedTable(tableName: string, fkCol: Column) {
    this.relatedTableNames.push(tableName);
    this.columns.push(fkCol);
  }

  public getRelatedTableNames() {
    return this.relatedTableNames;
  }

  public addRelationMapping(tableName: string, mapping: string) {
    this.importedModelNames.push(tableName);
    this.relationMappings.push(mapping);
  }

  private requiredColumnNamesQuoted() {
    return this.columns
      .filter(column => column.hasOption("required"))
      .map(column => `"${column.name}"`)
      .join(",");
  }

  private relatedModelImports() {
    return _.map(this.importedModelNames, (tableName: string) => {
      const modelName = capitalize(singularize(tableName));
      return `const ${modelName} = require("./${modelName}");`;
    }).join("\n");
  }

  private specialValidators() {
    return _.uniq(
      this.columns
        .map(column => column.getValidatorDetails())
        .filter(details => details.isSpecial)
        .map(details => details.validator)
    )
      .sort()
      .join(",");
  }

  private jsonSchemaProperties() {
    return this.columns
      .map(column => {
        const validator = column.getValidatorDetails().validator;
        return `${column.name}: ${validator}`;
      })
      .join(",");
  }

  public asKnexCreateTable() {
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

  public asKnexDropTable() {
    return `await knex.schema.dropTable("${this.name}");`;
  }

  public asObjectionModel() {
    return this.engine.renderTemplate("model-template.js.hbs", {
      tableName: this.name,
      modelName: capitalize(singularize(this.name)),
      relatedModels: this.relatedModelImports(),
      relationMappings: this.relationMappings,
      requiredProperties: this.requiredColumnNamesQuoted(),
      validators: this.specialValidators(),
      properties: this.jsonSchemaProperties()
    });
  }
}

type TableNamePair = [string, string];

class Tables {
  protected static tableByName: {
    [name: string]: Table;
  } = {};

  public static addTable(table: Table) {
    if (table.name in Tables.tableByName) {
      throw new Error("Duplicate table: '${table.name}'");
    }
    Tables.tableByName[table.name] = table;
  }

  public static findTable(name: string) {
    return Tables.tableByName[name];
  }

  public static asKnexMigration() {
    // Nodes are table names, edges are table dependencies.
    const allNodes = _.keys(Tables.tableByName);

    const allEdges = _.flatten(
      _.map(Tables.tableByName, table =>
        _.map(table.getRelatedTableNames(), relatedName => [
          table.name,
          relatedName
        ])
      )
    );

    let dropOrder = [];
    try {
      dropOrder = toposort.array(allNodes, allEdges);
    } catch (err) {
      console.error("Nodes", allNodes);
      console.error("Edges", allEdges);
      console.error(err);
      throw err;
    }
    const createOrder = [...dropOrder].reverse();

    debug("NAMES %O", allNodes);
    debug("EDGES %O", allEdges);
    debug("DROP %O", dropOrder);
    debug("CREATE %O", createOrder);

    const upMethod = `exports.up = async function(knex) {
      // Create partial order: ${createOrder.join(", ")}
      ${createOrder
        .map(tableName => Tables.tableByName[tableName].asKnexCreateTable())
        .join("\n")}
      };\n`;

    const downMethod = `exports.down = async function(knex) {
      ${dropOrder
        .map((tableName: string) =>
          Tables.tableByName[tableName].asKnexDropTable()
        )
        .join("\n")}
      };`;

    return [upMethod, downMethod].join("\n");
  }

  public static asObjectionModels() {
    return _.map(_.values(Tables.tableByName), table =>
      table.asObjectionModel()
    ).join("\n");
  }
}

// ---- Relationships

type RelType = "one-to-many" | "many-to-many";

interface OneToManyDef {
  type: RelType;
  one: string;
  many: string;
  options: string[];
}

interface ManyToManyDef {
  type: RelType;
  tableA: string;
  tableB: string;
}

type RelDef = OneToManyDef | ManyToManyDef;

class OneToManyRelationship {
  // The "one" side (e.g., "one department")
  private readonly oneTable: string;
  private readonly oneModel: string;
  private readonly oneRel: string;
  private readonly onePK: string;

  // The "many" side (e.g., "has many courses")
  private readonly manyTable: string;
  private readonly manyModel: string;
  private readonly manyRel: string;
  private readonly manyFK: string;

  // Other
  private readonly required: boolean;

  public constructor(private engine: TemplateEngine, rel: OneToManyDef) {
    this.oneTable = pluralize(rel.one);
    this.oneModel = capitalize(rel.one);
    this.oneRel = rel.many;
    this.onePK = `${this.oneTable}.id`;

    this.manyTable = rel.many;
    this.manyModel = capitalize(singularize(rel.many));
    this.manyRel = rel.one;
    this.manyFK = `${rel.one}_id`;

    this.required = !!(rel.options && rel.options.includes("required"));
  }

  public injectKnexForeignKey() {
    const options = [];

    if (this.required) {
      options.push("required");
    }
    options.push(`references("${this.onePK}")`);

    Tables.findTable(this.manyTable).addRelatedTable(
      this.oneTable,
      new Column(this.manyFK, "integer", options)
    );
  }

  public injectObjectionRelationMappings() {
    Tables.findTable(this.manyTable).addRelationMapping(
      this.oneTable,
      this.engine.renderTemplate("belongs-to-one.js.hbs", {
        relName: this.manyRel,
        modelClass: this.oneModel,
        fromCol: `${this.manyTable}.${this.manyFK}`,
        toCol: this.onePK
      })
    );

    Tables.findTable(this.oneTable).addRelationMapping(
      this.manyTable,
      this.engine.renderTemplate("has-many.js.hbs", {
        relName: this.oneRel,
        modelClass: this.manyModel,
        fromCol: `${this.manyTable}.${this.manyFK}`,
        toCol: `${this.oneTable}.id`
      })
    );
  }
}

class Relationships {
  public constructor(engine: TemplateEngine, relationships: RelDef[]) {
    const all = [];

    for (let rel of relationships) {
      all.push(rel);
      switch (rel.type) {
        case "one-to-many":
          {
            const relObj = new OneToManyRelationship(engine, <OneToManyDef>rel);
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

function prettyOutput(code: string) {
  try {
    console.log(prettier.format(code, { parser: "babel" }));
  } catch (err) {
    console.error(`Prettier failed: ${err}`);
    console.error(`Raw code ${code}`);
  }
}

try {
  const args = yargs
    .usage("usage: $0 [options] <model-file.yaml>")
    .version("0.1")
    .example(
      "$0 --template-dir=templates --schema-dir=schema models.yaml",
      "Process models.yaml with specified templates"
    )
    .option("template-dir", {
      description: "Template directory",
      type: 'string',
      demand: true
    })
    .option("schema-dir", {
      description: "Schema directory",
      type: 'string',
      demand: true
    })
    .demandCommand(1)
    .argv;

  const templateEngine = new TemplateEngine(args["template-dir"]);

  const doc = yaml.safeLoad(fs.readFileSync(args._[0], "utf-8"));

  const ajv = new Ajv();
  const schema = yaml.safeLoad(
    fs.readFileSync(path.join(args["schema-dir"], "model-schema.yaml"), "utf-8")
  );
  debug("SCHEMA %O", schema);

  const validate = ajv.compile(schema);
  if (!validate(doc)) {
    console.log("INVALID FILE", JSON.stringify(validate.errors, null, 2));
    process.exit(1);
  }

  _.forEach(doc.entities, entity =>
    Tables.addTable(new Table(templateEngine, entity))
  );
  const relationships = new Relationships(templateEngine, doc.relationships);

  // Dump these _after_ building relationships, which injects various data into the tables.
  debug("ENTITIES %O", Tables);
  debug("RELATIONSHIPS %O", relationships);

  prettyOutput(Tables.asKnexMigration());
  prettyOutput(Tables.asObjectionModels());
} catch (err) {
  console.error("ERROR", err);
}

#!/usr/bin/env node

// Include this:
//   require("source-map-support").install();
// or run using:
//   node -r source-map-support/register ...

import createDebug = require("debug");
const debug = createDebug("model-code");

import fs = require("fs");
import path = require("path");

import yargs = require("yargs");
import _ = require("lodash");
import yaml = require("js-yaml");

import prettier = require("prettier");
import { capitalize, pluralize, singularize } from "inflection";

import Ajv = require("ajv");
import { existsTypeAnnotation } from "@babel/types";
import { RaceSubscriber } from "rxjs/internal/observable/race";
import { config } from "rxjs";

// ---- Handy functions

const isSingular = (word: string) => singularize(word) === word;

// ---- Imports

class ImportMap {
  private importMap: Map<string, Set<string>>;

  constructor() {
    this.importMap = new Map();
  }

  public addEntry(importName: string, moduleName: string) {
    if (!this.importMap.has(moduleName)) {
      this.importMap.set(moduleName, new Set());
    }
    this.importMap.get(moduleName).add(importName);
  }

  public addEntries(importNames: string[], moduleName: string) {
    importNames.forEach(importName => this.addEntry(importName, moduleName));
  }

  public asString() {
    const statements: string[] = [];
    for (const [moduleName, importSet] of this.importMap) {
      const imports = Array.from(importSet).join(", ");
      statements.push(`import { ${imports} } from "${moduleName}";`);
    }

    return statements.join("\n");
  }
}

// ---- Entities

interface AttributeDef {
  name: string;
  type: string;
  options: string[];
}

interface AttributeSpec {
  type: string;
  length?: number;
}

class Attribute {
  private dbType: string; // Database type (e.g., "varchar")
  private jsType: string; // JavaScript type (e.g., "string")
  private gqlType: string; // GraphQL type (if any; e.g., "Int")
  private length: number; // String length (if any)

  public constructor(
    private readonly name: string,
    inputType: string,
    private readonly options: string[] = []
  ) {
    switch (inputType) {
      case "short-string":
        this.dbType = "varchar";
        this.jsType = "string";
        this.length = 16;
        break;
      case "medium-string":
        this.dbType = "varchar";
        this.jsType = "string";
        this.length = 64;
        break;
      case "long-string":
        this.dbType = "varchar";
        this.jsType = "string";
        this.length = 255;
        break;
      case "integer":
        this.dbType = "integer";
        this.jsType = "number";
        this.gqlType = "Int";
        break;
      case "date":
        this.dbType = inputType;
        this.jsType = "Date";
        break;
      default:
        throw new Error(`Invalid column type (${inputType}) for ${name}`);
    }
  }

  public hasOption(option: string) {
    return this.options.includes(option);
  }

  private columnDecorator() {
    let config = [`type: "${this.dbType}"`];

    if (this.length) {
      config.push(`length: ${this.length}`);
    }

    if (this.hasOption("unique")) {
      config.push("unique: true");
    }

    if (!this.hasOption("required")) {
      config.push("nullable: true"); // False by default.
    }

    return `@Column({${config.join(", ")}})`;
  }

  private fieldDecorator() {
    let config = [];

    if (this.gqlType) {
      config.push(`type => ${this.gqlType}`);
    }

    return `@Field(${config.join(", ")})`;
  }

  public asString() {
    const punctuation = this.hasOption("required") ? "" : "?";

    return `
    ${this.columnDecorator()}
    ${this.fieldDecorator()}
    ${this.name}${punctuation}: ${this.jsType};
    `;
  }
}

interface EntityDef {
  name: string;
  attributes: AttributeDef[];
}

class Entity {
  public readonly name: string;
  public readonly attributes: Attribute[];
  private importMap: ImportMap = new ImportMap();

  public constructor(entityDef: EntityDef) {
    const { name, attributes } = entityDef;

    if (isSingular(name)) {
      throw new Error(`Entity name "${name}" should be plural`);
    }

    this.name = name;
    this.attributes = _.map(
      attributes,
      (attribute: AttributeDef) =>
        new Attribute(attribute.name, attribute.type, attribute.options)
    );
    this.importMap.addEntries(
      ["Field", "Int", "ObjectType", "ArgsType"],
      "type-graphql"
    );
    this.importMap.addEntries(
      ["Column", "Entity", "PrimaryGeneratedColumn"],
      "typeorm"
    );
  }

  public asString() {
    return `
    ${this.importMap.asString()}

    @Entity("${this.name}")
    @ObjectType()
    export class ${capitalize(singularize(this.name))} {
      // PK

      @PrimaryGeneratedColumn()
      @Field(type => Int)
      id: number;

      // ATTRIBUTES
      ${this.attributes.map(attribute => attribute.asString()).join("")}

      // RELATIONSHIPS
    }`;
  }
}

class Entities {
  protected static entityByName: Map<string, Entity> = new Map();

  public static addEntity(entity: Entity) {
    if (Entities.entityByName.has(entity.name)) {
      throw new Error("Duplicate entity: '${entity.name}'");
    }
    Entities.entityByName.set(entity.name, entity);
  }

  public static findEntity(name: string) {
    return Entities.entityByName.get(name);
  }

  public static allEntities() {
    return Array.from(Entities.entityByName.values());
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
  entityA: string;
  entityB: string;
}

type RelDef = OneToManyDef | ManyToManyDef;

class OneToManyRelationship {
  // The "one" side (e.g., "one department")
  private readonly oneEntity: string;
  private readonly oneModel: string;
  private readonly oneRel: string;
  private readonly onePK: string;

  // The "many" side (e.g., "has many courses")
  private readonly manyEntity: string;
  private readonly manyModel: string;
  private readonly manyRel: string;
  private readonly manyFK: string;

  // Other
  private readonly required: boolean;

  public constructor(rel: OneToManyDef) {
    this.oneEntity = pluralize(rel.one);
    this.oneModel = capitalize(rel.one);
    this.oneRel = rel.many;
    this.onePK = `${this.oneEntity}.id`;

    this.manyEntity = rel.many;
    this.manyModel = capitalize(singularize(rel.many));
    this.manyRel = rel.one;
    this.manyFK = `${rel.one}_id`;

    this.required = !!(rel.options && rel.options.includes("required"));
  }
}

class Relationships {
  public constructor(relationships: RelDef[]) {
    const all = [];

    for (let rel of relationships) {
      all.push(rel);
      switch (rel.type) {
        case "one-to-many":
          {
            // const relObj = new OneToManyRelationship(engine, <OneToManyDef>rel);
            // relObj.injectKnexForeignKey();
            // relObj.injectObjectionRelationMappings();
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
    console.log(prettier.format(code, { parser: "typescript" }));
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
      type: "string",
      demand: true
    })
    .option("schema-dir", {
      description: "Schema directory",
      type: "string",
      demand: true
    })
    .demandCommand(1).argv;

  let doc = null;
  try {
    doc = yaml.safeLoad(fs.readFileSync(args._[0], "utf-8"));
  } catch (err) {
    console.error(`Can't load model file: ${err}`);
    process.exit(1);
  }

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

  _.forEach(doc.entities, (entity: EntityDef) =>
    Entities.addEntity(new Entity(entity))
  );
  const relationships = new Relationships(doc.relationships);

  // Dump these _after_ building relationships, which injects various data into the entities.
  debug("ENTITIES %O", Entities);
  debug("RELATIONSHIPS %O", relationships);

  Entities.allEntities().map(entity => prettyOutput(entity.asString()));
} catch (err) {
  console.error("ERROR", err);
}

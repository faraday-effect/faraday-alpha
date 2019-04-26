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
import yaml = require("js-yaml");

import prettier = require("prettier");
import { capitalize, pluralize, singularize } from "inflection";

import Ajv = require("ajv");
import { existsTypeAnnotation, stringLiteral } from "@babel/types";
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
      case "text":
        this.dbType = "text";
        this.jsType = "string";
        break;
      default:
        throw new Error(`Invalid column type (${inputType}) for ${name}`);
    }
  }

  public hasOption(option: string) {
    return this.options.includes(option);
  }

  public columnDecorator() {
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

  public fieldDecorator() {
    let config = [];

    if (this.gqlType) {
      config.push(`type => ${this.gqlType}`);
    }

    return `@Field(${config.join(", ")})`;
  }

  public declaration() {
    const punctuation = this.hasOption("required") ? "" : "?";

    return `${this.name}${punctuation}: ${this.jsType};`;
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
  private injectedRelationships: string[] = [];

  public constructor(entityDef: EntityDef) {
    const { name, attributes } = entityDef;

    if (isSingular(name)) {
      throw new Error(`Entity name "${name}" should be plural`);
    }

    this.name = name;
    this.attributes = attributes.map(
      (attribute: AttributeDef) =>
        new Attribute(attribute.name, attribute.type, attribute.options)
    );
    this.importMap.addEntries(
      ["Field", "Int", "ObjectType", "ArgsType", "InputType"],
      "type-graphql"
    );
    this.importMap.addEntries(
      ["Column", "Entity", "PrimaryGeneratedColumn"],
      "typeorm"
    );
  }

  public injectEntityImport(importName: string, moduleName: string) {
    this.importMap.addEntry(importName, moduleName);
  }

  public injectEntityImports(importNames: string[], moduleName: string) {
    this.importMap.addEntries(importNames, moduleName);
  }

  public injectRelationship(relationship: string) {
    this.injectedRelationships.push(relationship);
  }

  private entityClassAsString() {
    const attributeStrings = this.attributes.map(
      attribute => `
    ${attribute.columnDecorator()}
    ${attribute.fieldDecorator()}
    ${attribute.declaration()}`
    );

    return `
    // ----- ${this.name.toUpperCase()} -----

    ${this.importMap.asString()}

    @Entity("${this.name}")
    @ObjectType()
    export class ${capitalize(singularize(this.name))} {
      // PK

      @PrimaryGeneratedColumn()
      @Field(type => Int)
      id: number;

      // ATTRIBUTES
      ${attributeStrings.join("\n")}

      // RELATIONSHIPS
      ${this.injectedRelationships.join("\n\n")}
    }`;
  }

  private createInputClassAsString() {
    const attributeStrings = this.attributes.map(
      attribute => `
    ${attribute.fieldDecorator()}
    ${attribute.declaration()}`
    );

    return `
    @InputType()
    export class ${capitalize(singularize(this.name))}CreateInput {
      ${attributeStrings.join("\n")}
    }`;
  }

  public asString() {
    return [this.entityClassAsString(), this.createInputClassAsString()].join(
      "\n\n"
    );
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
  owner: string;
  other: string;
}

type RelDef = OneToManyDef | ManyToManyDef;

abstract class Relationship {
  abstract injectIntoEntities(): void;
}

class OneToManyRelationship extends Relationship {
  // The "one" side (e.g., "one department")
  private readonly oneSg: string;
  private readonly oneSgCap: string;
  private readonly onePl: string;

  // The "many" side (e.g., "has many courses")
  private readonly manySg: string;
  private readonly manySgCap: string;
  private readonly manyPl: string;

  // Other
  private readonly required: boolean;

  public constructor(rel: OneToManyDef) {
    super();

    this.oneSg = rel.one; // term
    this.oneSgCap = capitalize(rel.one); // Term
    this.onePl = pluralize(rel.one); // terms

    this.manySg = singularize(rel.many); // holiday
    this.manySgCap = capitalize(singularize(rel.many)); // Holiday
    this.manyPl = rel.many; // holidays

    this.required = !!(rel.options && rel.options.includes("required"));
  }

  private asOneToMany() {
    return `
    @OneToMany(type => ${this.manySgCap}, 
      ${this.manySg} => ${this.manySg}.${this.oneSg})
    @Field(type => [${this.manySgCap}])
    ${this.manyPl}${this.required ? "" : "?"}: ${this.manySgCap}[];`;
  }

  private asManyToOne() {
    return `
    @ManyToOne(type => ${this.oneSgCap}, 
      ${this.oneSg} => ${this.oneSg}.${this.manyPl})
    @Field(type => ${this.oneSgCap})
    ${this.oneSg}${this.required ? "" : "?"}: ${this.oneSgCap};`;
  }

  public injectIntoEntities() {
    const oneEntity = Entities.findEntity(this.onePl);
    oneEntity.injectEntityImport("OneToMany", "typeorm");
    oneEntity.injectRelationship(this.asOneToMany());

    const manyEntity = Entities.findEntity(this.manyPl);
    manyEntity.injectEntityImport("ManyToOne", "typeorm");
    manyEntity.injectRelationship(this.asManyToOne());
  }
}

class ManyToManyRelationship extends Relationship {
  // Owner side
  private readonly ownerSg: string;
  private readonly ownerSgCap: string;
  private readonly ownerPl: string;

  // Other side
  private readonly otherSg: string;
  private readonly otherSgCap: string;
  private readonly otherPl: string;

  public constructor(rel: ManyToManyDef) {
    super();

    this.ownerSg = singularize(rel.owner); // user
    this.ownerSgCap = capitalize(singularize(rel.owner)); // User
    this.ownerPl = rel.owner; // users

    this.otherSg = singularize(rel.other); // role
    this.otherSgCap = capitalize(singularize(rel.other)); // Role
    this.otherPl = rel.other; // roles
  }

  private asOwner() {
    return `
    @ManyToMany(type => ${this.otherSgCap},
     ${this.otherSg} => ${this.otherSg}.${this.ownerPl})
    @JoinTable()
    ${this.otherPl}: ${this.otherSgCap}[];`;
  }

  private asOther() {
    return `
    @ManyToMany(type => ${this.ownerSgCap},
      ${this.ownerSg} => ${this.ownerSg}.${this.otherPl})
    ${this.ownerPl}: ${this.ownerSgCap}[];`;
  }

  public injectIntoEntities() {
    const ownerEntity = Entities.findEntity(this.ownerPl);
    ownerEntity.injectRelationship(this.asOwner());
    ownerEntity.injectEntityImports(["ManyToMany", "JoinTable"], "typeorm");

    const otherEntity = Entities.findEntity(this.otherPl);
    otherEntity.injectRelationship(this.asOther());
    otherEntity.injectEntityImport("ManyToMany", "typeorm");
  }
}

function relationshipFactory(relDef: RelDef) {
  switch (relDef.type) {
    case "one-to-many":
      return new OneToManyRelationship(relDef as OneToManyDef);
      break;

    case "many-to-many":
      return new ManyToManyRelationship(relDef as ManyToManyDef);
      break;

    default:
      throw new Error("Invalid relationship type: '${rel.type}'");
  }
}

function prettify(code: string) {
  try {
    return prettier.format(code, { parser: "typescript" });
  } catch (err) {
    console.error(`Prettier failed: ${err}`);
    console.error(`Raw code ${code}`);
  }
}

try {
  // Command-line arguments.
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

  // Load the models YAML file.
  let doc = null;
  try {
    doc = yaml.safeLoad(fs.readFileSync(args._[0], "utf-8"));
  } catch (err) {
    console.error(`Can't load model file: ${err}`);
    process.exit(1);
  }

  // Load the JSON schema.
  const ajv = new Ajv();
  const schema = yaml.safeLoad(
    fs.readFileSync(path.join(args["schema-dir"], "model-schema.yaml"), "utf-8")
  );
  debug("SCHEMA %O", schema);

  // Validate the YAML document.
  const validate = ajv.compile(schema);
  if (!validate(doc)) {
    console.log(
      "INVALID MODEL DOCUMENT",
      JSON.stringify(validate.errors, null, 2)
    );
    process.exit(1);
  }

  // Process the entities.
  doc.entities.forEach((entityDef: EntityDef) =>
    Entities.addEntity(new Entity(entityDef))
  );

  // Process the relationships.
  doc.relationships.forEach((relDef: RelDef) => {
    const relationship = relationshipFactory(relDef);
    relationship.injectIntoEntities();
  });

  // Dump these _after_ building relationships, which injects various data into the entities.
  debug("ENTITIES %O", Entities);
  debug("RELATIONSHIPS %O", doc.relationships);

  // Output everything.
  Entities.allEntities().map(entity => {
    fs.writeFileSync(
      `${singularize(entity.name)}.entity.ts`,
      prettify(entity.asString())
    );
  });
} catch (err) {
  console.error("ERROR", err);
}

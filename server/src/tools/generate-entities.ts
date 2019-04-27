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
import { currentDateAndTime } from "../utils/date-and-time";

// ---- Handy functions

const isSingular = (word: string) => singularize(word) === word;

// ---- Imports

class ImportMap {
  private importsByModule: Map<string, Set<string>>;

  constructor() {
    this.importsByModule = new Map();
  }

  public addEntry(importName: string, moduleName: string) {
    if (!this.importsByModule.has(moduleName)) {
      this.importsByModule.set(moduleName, new Set());
    }
    this.importsByModule.get(moduleName).add(importName);
  }

  public addEntries(importNames: string[], moduleName: string) {
    importNames.forEach(importName => this.addEntry(importName, moduleName));
  }

  public asString() {
    const statements: string[] = [];
    for (const [moduleName, importSet] of this.importsByModule) {
      const imports = Array.from(importSet).join(", ");
      statements.push(`import { ${imports} } from "${moduleName}";`);
    }

    return statements.join("\n");
  }
}

// ---- Attributes

interface AttributeInput {
  name: string;
  type: string;
  options: string[];
}

abstract class Attribute {
  abstract name(): string;
  abstract type(): string;
  abstract columnDecorator(): string;
  abstract fieldDecorator(): string;
  abstract declaration(): string;

  constructor(private readonly options: string[]) {}

  hasOption(option: string) {
    return this.options.includes(option);
  }

  asString() {
    return [
      this.columnDecorator(),
      this.fieldDecorator(),
      this.declaration()
    ].join("\n");
  }
}

class PropertyAttribute extends Attribute {
  private dbType: string; // Database type (e.g., "varchar")
  private readonly jsType: string; // JavaScript type (e.g., "string")
  private gqlType: string; // GraphQL type (if any; e.g., "Int")
  private length: number; // String length (if any)

  constructor(
    private readonly inputName: string,
    private readonly inputType: string,
    private readonly inputOptions: string[] = []
  ) {
    super(inputOptions);

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
        throw new Error(`Invalid column type (${inputType}) for ${inputName}`);
    }
  }

  name() {
    return this.inputName;
  }

  type() {
    return this.jsType;
  }

  columnDecorator() {
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

  fieldDecorator() {
    let config = [];

    if (this.gqlType) {
      config.push(`type => ${this.gqlType}`);
    }

    return `@Field(${config.join(", ")})`;
  }

  declaration() {
    const punctuation = this.hasOption("required") ? "" : "?";

    return `${this.inputName}${punctuation}: ${this.jsType};`;
  }
}

class RelationshipAttribute extends Attribute {
  constructor(
    private readonly columnDecoratorString: string,
    private readonly fieldDecoratorString: string,
    private readonly propertyName: string,
    private readonly propertyType: string,
    private readonly isRequired: boolean
  ) {
    super(isRequired ? ["required"] : []);
  }

  name() {
    return this.propertyName;
  }

  type() {
    return this.propertyType;
  }

  columnDecorator() {
    return this.columnDecoratorString;
  }

  fieldDecorator() {
    return this.fieldDecoratorString;
  }

  declaration() {
    return `${this.propertyName}${this.isRequired ? "" : "?"}: ${
      this.propertyType
    }`;
  }
}

// ---- Entities

interface EntityDef {
  name: string;
  attributes: AttributeInput[];
}

class Entity {
  public readonly name: string;
  public readonly className: string;
  public readonly attributes: Attribute[];
  private importMap: ImportMap = new ImportMap();

  public constructor(entityDef: EntityDef) {
    const { name, attributes } = entityDef;

    if (isSingular(name)) {
      throw new Error(`Entity name "${name}" should be plural`);
    }

    this.name = name;
    this.className = capitalize(singularize(this.name));
    this.attributes = attributes.map(
      (attribute: AttributeInput) =>
        new PropertyAttribute(attribute.name, attribute.type, attribute.options)
    );
    this.importMap.addEntries(
      ["Field", "Int", "ObjectType", "InputType"],
      "type-graphql"
    );
    this.importMap.addEntries(
      ["Column", "Entity", "PrimaryGeneratedColumn"],
      "typeorm"
    );
  }

  public addImport(importName: string, moduleName: string) {
    this.importMap.addEntry(importName, moduleName);
  }

  public addAttribute(attribute: Attribute) {
    this.attributes.push(attribute);
  }

  private createInputAsString() {
    const inputAttributeStrings = this.attributes.map(
      attribute => `
    ${attribute.fieldDecorator()}
    ${attribute.declaration()}`
    );

    return `
    @InputType()
    export class ${this.className}CreateInput {
      ${inputAttributeStrings.join("\n")}
    }`;
  }

  private whereUniqueInputAsString() {
    const uniqueAttributeStrings = this.attributes
      .filter(attribute => attribute.hasOption("unique"))
      .map(attribute => `${attribute.name()}?: ${attribute.type()}`);

    uniqueAttributeStrings.unshift("id?: number");

    return `
    export interface ${this.className}WhereUniqueInput {
      ${uniqueAttributeStrings.join("\n")}
    }`;
  }

  private whereInputAsString() {
    const whereAttributeStrings = this.attributes.map(
      attribute => `${attribute.name()}?: ${attribute.type()}`
    );

    return `
    export interface ${this.className}WhereInput {
      ${whereAttributeStrings.join("\n")}
    }`;
  }

  private updateInputAsString() {
    const updateAttributeStrings = this.attributes.map(
      attribute => `${attribute.name()}?: ${attribute.type()}`
    );

    return `
    export interface ${this.className}UpdateInput {
      ${updateAttributeStrings.join("\n")}
    }`;
  }

  private orderByInputAsString() {
    const orderByAttributeStrings = this.attributes.map(
      attribute => `${attribute.name()}Asc, ${attribute.name()}Desc`
    );

    return `
    export enum ${this.className}OrderByInput {
      ${orderByAttributeStrings.join(",")}
    }`;
  }

  public asString() {
    return `
    // ----- ${this.name.toUpperCase()} -----
    // Generated ${currentDateAndTime()}

    ${this.importMap.asString()}

    @Entity("${this.name}")
    @ObjectType()
    export class ${this.className} {
      @PrimaryGeneratedColumn()
      @Field(type => Int)
      id: number;

      ${this.attributes.map(attribute => attribute.asString()).join("\n\n")}
    }

    ${this.createInputAsString()}
    ${this.whereUniqueInputAsString()}
    ${this.whereInputAsString()}
    ${this.updateInputAsString()}
    ${this.orderByInputAsString()}
    `;
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

class RelationshipFactory {
  constructor(private readonly useSubdirs: boolean) {}

  private modulePath(baseName: string, useSubdirs: boolean) {
    if (useSubdirs) {
      return path.join("..", baseName, `${baseName}.entity`);
    } else {
      return path.join(".", `${baseName}.entity`);
    }
  }

  private buildOneToManyRelationship(rel: OneToManyDef) {
    // The "one" side (e.g., "one term")
    const oneSg = rel.one; // term
    const oneSgCap = capitalize(rel.one); // Term
    const onePl = pluralize(rel.one); // terms

    // The "many" side (e.g., "has many holidays")
    const manySg = singularize(rel.many); // holiday
    const manySgCap = capitalize(singularize(rel.many)); // Holiday
    const manyPl = rel.many; // holidays

    const required = !!(rel.options && rel.options.includes("required"));

    const oneEntity = Entities.findEntity(onePl);
    oneEntity.addImport("OneToMany", "typeorm");
    oneEntity.addImport(manySgCap, this.modulePath(manySg, this.useSubdirs));
    oneEntity.addAttribute(
      new RelationshipAttribute(
        `@OneToMany(type => ${manySgCap}, ${manySg} => ${manySg}.${oneSg})`,
        `@Field(type => [${manySgCap}])`,
        oneSg,
        oneSgCap,
        required
      )
    );

    const manyEntity = Entities.findEntity(manyPl);
    manyEntity.addImport("ManyToOne", "typeorm");
    manyEntity.addImport(oneSgCap, this.modulePath(oneSg, this.useSubdirs));
    manyEntity.addAttribute(
      new RelationshipAttribute(
        `@ManyToOne(type => ${oneSgCap}, ${oneSg} => ${oneSg}.${manyPl})`,
        `@Field(type => ${oneSgCap})`,
        oneSg,
        oneSgCap,
        required
      )
    );
  }

  private buildManyToManyRelationship(rel: ManyToManyDef) {
    // The "owner" side (e.g., "users")
    const ownerSg = singularize(rel.owner); // user
    const ownerSgCap = capitalize(singularize(rel.owner)); // User
    const ownerPl = rel.owner; // users

    // The "other" side (e.g., "have roles")
    const otherSg = singularize(rel.other); // role
    const otherSgCap = capitalize(singularize(rel.other)); // Role
    const otherPl = rel.other; // roles

    // Owner side
    const ownerEntity = Entities.findEntity(ownerPl);
    ownerEntity.addImport("ManyToMany", "typeorm");
    ownerEntity.addImport("JoinTable", "typeorm");
    ownerEntity.addImport(
      otherSgCap,
      this.modulePath(otherSg, this.useSubdirs)
    );
    ownerEntity.addAttribute(
      new RelationshipAttribute(
        `@ManyToMany(type => ${otherSgCap}, ${otherSg} => ${otherSg}.${ownerPl}) @JoinTable()`,
        "",
        otherPl,
        `${otherSgCap}[]`,
        false
      )
    );

    // Other side.
    const otherEntity = Entities.findEntity(otherPl);
    otherEntity.addImport("ManyToMany", "typeorm");
    otherEntity.addImport(
      ownerSgCap,
      this.modulePath(ownerSg, this.useSubdirs)
    );
    otherEntity.addAttribute(
      new RelationshipAttribute(
        `@ManyToMany(type => ${ownerSgCap}, ${ownerSg} => ${ownerSg}.${otherPl})`,
        "",
        ownerPl,
        `${ownerSgCap}[]`,
        false
      )
    );
  }

  build(relDef: RelDef) {
    switch (relDef.type) {
      case "one-to-many":
        this.buildOneToManyRelationship(relDef as OneToManyDef);
        break;

      case "many-to-many":
        this.buildManyToManyRelationship(relDef as ManyToManyDef);
        break;

      default:
        throw new Error("Invalid relationship type: '${rel.type}'");
    }
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
    .strict()
    .usage("usage: $0 [options] <model-file.yaml>")
    .version("0.1")
    .example(
      "$0 --schema=model-schema.yaml models.yaml",
      "Process models.yaml with specified templates"
    )
    .option("schema", {
      description: "JSON schema",
      type: "string",
      demand: true
    })
    .option("out-dir", {
      description: "Output directory",
      type: "string",
      default: "."
    })
    .option("sub-dirs", {
      description: "Use subdirectories with the same name as the entity",
      type: "boolean",
      default: false
    })
    .demandCommand(1).argv;

  debug("ARGS %O", args);

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
  const schema = yaml.safeLoad(fs.readFileSync(args.schema, "utf-8"));
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
  const relationshipFactory = new RelationshipFactory(args["sub-dirs"]);
  doc.relationships.forEach((relDef: RelDef) => {
    relationshipFactory.build(relDef);
  });

  // Dump these _after_ building relationships, which injects various data into the entities.
  debug("ENTITIES %O", Entities);
  debug("RELATIONSHIPS %O", doc.relationships);

  // Output everything.
  Entities.allEntities().map(entity => {
    const entityName = singularize(entity.name);
    const entityDir = path.join(
      args["out-dir"],
      args["sub-dirs"] ? entityName : ""
    );
    const entityPath = path.join(entityDir, `${entityName}.entity.ts`);

    fs.mkdirSync(entityDir, { recursive: true, mode: 0o755 });
    fs.writeFileSync(entityPath, prettify(entity.asString()));
  });
} catch (err) {
  console.error("ERROR", err);
}

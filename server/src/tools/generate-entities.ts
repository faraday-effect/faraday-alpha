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
  public readonly jsType: string; // JavaScript type (e.g., "string")
  private gqlType: string; // GraphQL type (if any; e.g., "Int")
  private length: number; // String length (if any)

  public constructor(
    public readonly name: string,
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
  public readonly className: string;
  public readonly attributes: Attribute[];
  private importMap: ImportMap = new ImportMap();
  private injectedRelationships: string[] = [];
  private injectedDeclarations: string[] = [];

  public constructor(entityDef: EntityDef) {
    const { name, attributes } = entityDef;

    if (isSingular(name)) {
      throw new Error(`Entity name "${name}" should be plural`);
    }

    this.name = name;
    this.className = capitalize(singularize(this.name));
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

  private injectCreateInput() {
    const inputAttributeStrings = this.attributes.map(
      attribute => `
    ${attribute.fieldDecorator()}
    ${attribute.declaration()}`
    );

    this.injectedDeclarations.push(`
    @InputType()
    export class ${this.className}CreateInput {
      ${inputAttributeStrings.join("\n")}
    }`);
  }

  private injectWhereUniqueInput() {
    const uniqueAttributeStrings = this.attributes
      .filter(attribute => attribute.hasOption("unique"))
      .map(attribute => `${attribute.name}?: ${attribute.jsType}`);

    uniqueAttributeStrings.unshift("id?: number");

    this.injectedDeclarations.push(`
    export interface ${this.className}WhereUniqueInput {
      ${uniqueAttributeStrings.join("\n")}
    }`);
  }

  private injectWhereInput() {
    const whereAttributeStrings = this.attributes.map(
      attribute => `${attribute.name}?: ${attribute.jsType}`
    );

    this.injectedDeclarations.push(`
    export interface ${this.className}WhereInput {
      ${whereAttributeStrings.join("\n")}
    }`);
  }

  private injectUpdateInput() {
    const updateAttributeStrings = this.attributes.map(
      attribute => `${attribute.name}?: ${attribute.jsType}`
    );

    this.injectedDeclarations.push(`
    export interface ${this.className}UpdateInput {
      ${updateAttributeStrings.join("\n")}
    }`);
  }

  private injectOrderByInput() {
    const orderByAttributeStrings = this.attributes.map(
      attribute => `${attribute.name}Asc, ${attribute.name}Desc`
    );

    this.injectedDeclarations.push(`
    export enum ${this.className}OrderByInput {
      ${orderByAttributeStrings.join(",")}
    }`);
  }

  public asString() {
    this.injectCreateInput();
    this.injectWhereUniqueInput();
    this.injectWhereInput();
    this.injectUpdateInput();
    this.injectOrderByInput();

    const attributeStrings = this.attributes.map(
      attribute => `
    ${attribute.columnDecorator()}
    ${attribute.fieldDecorator()}
    ${attribute.declaration()}`
    );

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

      ${attributeStrings.join("\n")}

      ${this.injectedRelationships.join("\n\n")}
    }
    
    ${this.injectedDeclarations.join("\n\n")}
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

abstract class Relationship {
  protected modulePath(baseName: string, useSubdirs: boolean) {
    if (useSubdirs) {
      return path.join("..", baseName, `${baseName}.entity`);
    } else {
      return path.join(".", `${baseName}.entity`);
    }
  }

  abstract injectIntoEntities(useSubdirs: boolean): void;
}

class AOneToManyRel extends Relationship {
  constructor(
    private readonly oneSg,
    private readonly onePl,
    private readonly manySg,
    private readonly manySgCap,
    private readonly manyPl,
    private readonly required
  ) {
    super();
  }

  public injectIntoEntity() {
    const oneEntity = Entities.findEntity(this.onePl);
    oneEntity.injectEntityImport("OneToMany", "typeorm");
    oneEntity.injectEntityImport(
      this.manySgCap,
      this.modulePath(this.manySg, useSubdirs)
    );
    oneEntity.injectRelationship(this);
  }

  public asString() {
    return `
    @OneToMany(type => ${this.manySgCap}, 
    ${this.manySg} => ${this.manySg}.${this.oneSg})
    @Field(type => [${this.manySgCap}])
    ${this.manyPl}${this.required ? "" : "?"}: ${this.manySgCap}[];`;
  }
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

  public injectIntoEntities(useSubdirs: boolean) {
    const oneEntity = Entities.findEntity(this.onePl);
    oneEntity.injectEntityImport("OneToMany", "typeorm");
    oneEntity.injectEntityImport(
      this.manySgCap,
      this.modulePath(this.manySg, useSubdirs)
    );
    oneEntity.injectRelationship(this.asOneToMany());

    const manyEntity = Entities.findEntity(this.manyPl);
    manyEntity.injectEntityImport("ManyToOne", "typeorm");
    manyEntity.injectEntityImport(
      this.oneSgCap,
      this.modulePath(this.oneSg, useSubdirs)
    );
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

  public injectIntoEntities(useSubdirs: boolean) {
    const ownerEntity = Entities.findEntity(this.ownerPl);
    ownerEntity.injectEntityImports(["ManyToMany", "JoinTable"], "typeorm");
    ownerEntity.injectEntityImport(
      this.otherSgCap,
      this.modulePath(this.otherSg, useSubdirs)
    );
    ownerEntity.injectRelationship(this.asOwner());

    const otherEntity = Entities.findEntity(this.otherPl);
    otherEntity.injectEntityImport("ManyToMany", "typeorm");
    otherEntity.injectEntityImport(
      this.ownerSgCap,
      this.modulePath(this.ownerSg, useSubdirs)
    );
    otherEntity.injectRelationship(this.asOther());
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
  doc.relationships.forEach((relDef: RelDef) => {
    const relationship = relationshipFactory(relDef);
    relationship.injectIntoEntities(args["sub-dirs"]);
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

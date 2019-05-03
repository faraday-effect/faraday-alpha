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
import { hashFile, hashString } from "../utils/message-digest";

import Ajv = require("ajv");

// ---- Handy functions

const isSingular = (word: string) => singularize(word) === word;

/**
 * Generate a header for this file.
 *
 * This used to include a time stamp, but that thwarted the MD5
 * that determines whether or not to regenerate the file.
 * @param name Name to include in the header
 */
function fileHeader(name: string) {
  return `// ----- ${name.toUpperCase()} -----`;
}

function prettify(code: string) {
  try {
    return prettier.format(code, { parser: "typescript" });
  } catch (err) {
    console.error(`Prettier failed: ${err}`);
    console.error(`Raw code ${code}`);
    throw err;
  }
}

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

    const entry = this.importsByModule.get(moduleName);
    if (!entry) {
      throw new Error(`Can't find module '${moduleName}'`);
    }
    entry.add(importName);
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

  isRequired() {
    return this.hasOption("required");
  }

  isUnique() {
    return this.hasOption("unique");
  }

  isPrimaryKey() {
    return this.hasOption("pk");
  }

  isRelationship() {
    return this.hasOption("relationship");
  }

  asString() {
    return [
      this.columnDecorator(),
      this.fieldDecorator(),
      this.declaration()
    ].join("\n");
  }
}

class YamlAttribute extends Attribute {
  private dbType: string; // Database type (e.g., "varchar")
  private readonly jsType: string; // JavaScript type (e.g., "string")
  private gqlType: string; // GraphQL type (if any; e.g., "Int")
  private length: number; // String length (if any)

  constructor(
    private readonly inputName: string,
    inputType: string,
    inputOptions: string[] = []
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

    if (this.isUnique()) {
      config.push("unique: true");
    }

    if (!this.isRequired()) {
      config.push("nullable: true"); // False by default.
    }

    return `@Column({${config.join(", ")}})`;
  }

  fieldDecorator() {
    let config: string[] = [];

    if (this.gqlType) {
      config.push(`() => ${this.gqlType}`);
    }

    return `@Field(${config.join(", ")})`;
  }

  declaration() {
    const punctuation = this.isRequired() ? "" : "?";

    return `${this.inputName}${punctuation}: ${this.jsType};`;
  }
}

class ProgrammaticAttribute extends Attribute {
  constructor(
    private readonly columnDecoratorString: string,
    private readonly fieldDecoratorString: string,
    private readonly propertyName: string,
    private readonly propertyType: string,
    inputOptions: string[] = []
  ) {
    super(inputOptions);
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
    return `${this.propertyName}${this.isRequired() ? "" : "?"}: ${
      this.propertyType
    }`;
  }
}

// ---- Entities

interface EntityInput {
  name: string;
  attributes: AttributeInput[];
}

class Entity {
  public readonly name: string;
  public readonly className: string;
  public readonly attributes: Attribute[] = [];
  private importMap: ImportMap = new ImportMap();

  public constructor(entityDef: EntityInput) {
    const { name: entityName, attributes: inputAttributes } = entityDef;

    if (isSingular(entityName)) {
      throw new Error(`Entity name "${entityName}" should be plural`);
    }

    this.name = entityName;
    this.className = capitalize(singularize(this.name));

    // Primary key
    this.addAttribute(
      new ProgrammaticAttribute(
        "@PrimaryGeneratedColumn()",
        "@Field(type => Int)",
        "id",
        "number",
        ["required", "unique", "pk"]
      )
    );

    // Additional attributes from the input file.
    inputAttributes.forEach((attribute: AttributeInput) =>
      this.addAttribute(
        new YamlAttribute(attribute.name, attribute.type, attribute.options)
      )
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
    const createInputStrings = this.attributes
      .filter(
        attribute => !(attribute.isPrimaryKey() || attribute.isRelationship())
      )
      .map(
        attribute => `
        ${attribute.fieldDecorator()}
        ${attribute.declaration()}`
      );

    return `
    @InputType()
    export class ${this.className}CreateInput 
        implements Partial<${this.className}> {
      ${createInputStrings.join("\n")}
    }`;
  }

  private whereUniqueInputAsString() {
    const uniqueAttributeStrings = this.attributes
      .filter(attribute => attribute.isUnique())
      .map(attribute => `${attribute.name()}?: ${attribute.type()}`);

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
    return `${fileHeader(this.name)}

    ${this.importMap.asString()}

    @Entity("${this.name}")
    @ObjectType()
    export class ${this.className} {
      ${this.attributes.map(attribute => attribute.asString()).join("\n\n")}
    }

    ${this.createInputAsString()}
    ${this.whereUniqueInputAsString()}
    ${this.whereInputAsString()}
    ${this.updateInputAsString()}
    ${this.orderByInputAsString()}`;
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
    const entity = Entities.entityByName.get(name);
    if (!entity) {
      throw new Error(`Can't find entity '${name}'`);
    }
    return entity;
  }

  public static allEntities() {
    return Array.from(Entities.entityByName.values());
  }

  public static size() {
    return this.entityByName.size;
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

    const attributeOptions = ["relationship"];
    const required = !!(rel.options && rel.options.includes("required"));
    if (required) {
      attributeOptions.push("required");
    }

    const oneEntity = Entities.findEntity(onePl);
    oneEntity.addImport("OneToMany", "typeorm");
    oneEntity.addImport(manySgCap, this.modulePath(manySg, this.useSubdirs));
    oneEntity.addAttribute(
      new ProgrammaticAttribute(
        `@OneToMany(() => ${manySgCap}, ${manySg} => ${manySg}.${oneSg})`,
        `@Field(type => [${manySgCap}])`,
        manyPl,
        `${manySgCap}[]`,
        attributeOptions
      )
    );

    const manyEntity = Entities.findEntity(manyPl);
    manyEntity.addImport("ManyToOne", "typeorm");
    manyEntity.addImport(oneSgCap, this.modulePath(oneSg, this.useSubdirs));
    manyEntity.addAttribute(
      new ProgrammaticAttribute(
        `@ManyToOne(() => ${oneSgCap}, ${oneSg} => ${oneSg}.${manyPl})`,
        `@Field(() => ${oneSgCap})`,
        oneSg,
        oneSgCap,
        attributeOptions
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
      new ProgrammaticAttribute(
        `@ManyToMany(() => ${otherSgCap}, ${otherSg} => ${otherSg}.${ownerPl}) @JoinTable()`,
        "",
        otherPl,
        `${otherSgCap}[]`,
        ["relationship"]
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
      new ProgrammaticAttribute(
        `@ManyToMany(() => ${ownerSgCap}, ${ownerSg} => ${ownerSg}.${otherPl})`,
        "",
        ownerPl,
        `${ownerSgCap}[]`,
        ["relationship"]
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

// ---- Services

class Service {
  private importMap: ImportMap;
  private nameSg: string;
  private nameSgCap: string;

  constructor(entityName: string) {
    this.nameSg = singularize(entityName);
    this.nameSgCap = capitalize(this.nameSg);

    this.importMap = new ImportMap();
    this.importMap.addEntry("Injectable", "@nestjs/common");
    this.importMap.addEntry("InjectRepository", "@nestjs/typeorm");
    this.importMap.addEntry("Repository", "typeorm");

    this.importMap.addEntries(
      [
        "", // Base class
        "CreateInput",
        "WhereUniqueInput",
        "WhereInput",
        "OrderByInput",
        "UpdateInput"
      ].map(suffix => `${this.nameSgCap}${suffix}`),
      `./${this.nameSg}.entity`
    );
  }

  asString() {
    const nameSg = this.nameSg;
    const nameSgCap = capitalize(nameSg);
    const namePl = pluralize(nameSg);
    const namePlCap = capitalize(namePl);

    const header = fileHeader(`${nameSg} service`);
    return `${header}

    ${this.importMap.asString()}

    @Injectable()
    export class ${nameSgCap}Service {
      constructor(
        @InjectRepository(${nameSgCap}) 
        private readonly ${this.nameSg}Repository: Repository<${nameSgCap}>
      ){}

      // Create
      async create(data: ${nameSgCap}CreateInput) {
        const new${nameSgCap} = this.${nameSg}Repository.create(data);
        return await this.${nameSg}Repository.save(new${nameSgCap});
      }
        
      async upsert${nameSgCap}(args: {
        where: ${nameSgCap}WhereUniqueInput;
        create: ${nameSgCap}CreateInput;
        update: ${nameSgCap}UpdateInput;
      }) {}

      // Read
      async ${nameSg}(where: ${nameSgCap}WhereUniqueInput) {
        return await this.${nameSg}Repository.findOne(where);
      }

      async ${namePl}(args?: {
        where?: ${nameSgCap}WhereInput;
        orderBy?: ${nameSgCap}OrderByInput;
        skip?: number;
        take?: number;
      }) {
        if (args) {
          return await this.${nameSg}Repository.find(args.where);
        } else {
          return await this.${nameSg}Repository.find();
        }
      }

      // Update
      async update${nameSgCap}(args: { data: ${nameSgCap}UpdateInput; where: ${nameSgCap}WhereUniqueInput }) {}

      async updateMany${namePlCap}(args: { data: ${nameSgCap}UpdateInput; where?: ${nameSgCap}WhereInput }) {}

      // Delete
      async delete${nameSgCap}(where: ${nameSgCap}WhereUniqueInput) {}

      async deleteMany${namePlCap}(where?: ${nameSgCap}WhereInput) {}
    }`;
  }
}

// ---- Main

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
    .option("only", {
      description: "Only generate the listed entities (comma separated list)",
      type: "string"
    })
    .option("overwrite", {
      description: "Overwrite existing output files",
      type: "boolean",
      default: false
    })
    .option("verbose", {
      description: "Ouptut additional details on what's happening",
      type: "boolean",
      default: false
    })
    .demandCommand(1).argv;

  /**
   * Check whether the file at `path` exists, and if so, contains `content`
   * @param path Location of file to check.
   * @param content Content to check for.
   */
  function alreadyContains(path: fs.PathLike, content: string) {
    if (fs.existsSync(path)) {
      return hashFile(path) === hashString(content);
    }
    return false;
  }

  /**
   * Write `path` with `content` if it doesn't already contain it.
   * Do so unconditionally if the command line `overwrite` flag is set.
   * @param path Path to the file
   * @param content Content to write there
   */
  function maybeWriteFileSync(path: fs.PathLike, content: string) {
    if (args.overwrite || !alreadyContains(path, content)) {
      fs.writeFileSync(path, content);
      if (args.verbose) console.debug(`Wrote '${path}'`);
    } else if (args.verbose) {
      console.debug(`Skipped writing '${path}'`);
    }
  }

  // Load the models YAML file.
  let doc;
  try {
    doc = yaml.safeLoad(fs.readFileSync(args._[0], "utf-8"));
  } catch (err) {
    console.error(`Can't load model file: ${err}`);
    process.exit(1);
  }
  if (args.verbose) console.debug(`Loaded models from '${args._[0]}'`);

  // Load the JSON schema.
  const ajv = new Ajv();
  const schema = yaml.safeLoad(fs.readFileSync(args.schema, "utf-8"));
  if (args.verbose) console.debug(`Loaded schema from '${args.schema}'`);
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
  if (args.verbose) console.debug("Model file validated successfully");

  // Process the entities.
  doc.entities.forEach((entityDef: EntityInput) =>
    Entities.addEntity(new Entity(entityDef))
  );

  // Process the relationships.
  const relationshipFactory = new RelationshipFactory(args["sub-dirs"]);
  doc.relationships.forEach((relDef: RelDef) => {
    relationshipFactory.build(relDef);
  });
  if (args.verbose) {
    console.debug(`Loaded ${Entities.size()} entities`);
  }

  // Dump these _after_ building relationships, which injects various data into the entities.
  debug("ENTITIES %O", Entities);
  debug("RELATIONSHIPS %O", doc.relationships);

  // Generate output.
  let onlyTheseEntities: string[] = [];
  if (args["only"]) {
    onlyTheseEntities = args["only"].split(/\s*,\s*/);
  }

  Entities.allEntities().map(entity => {
    if (
      onlyTheseEntities.length == 0 ||
      onlyTheseEntities.includes(entity.name)
    ) {
      // We're not filtering or we found the entity in the filter list.
      const entityName = singularize(entity.name);
      const destinationDir = path.join(
        args["out-dir"],
        args["sub-dirs"] ? entityName : ""
      );

      // Make sure the directory exists.
      fs.mkdirSync(destinationDir, { recursive: true, mode: 0o755 });

      // Ouptut the entity file.
      maybeWriteFileSync(
        path.join(destinationDir, `${entityName}.entity.ts`),
        prettify(entity.asString())
      );

      // Output the service file.
      const service = new Service(entity.name);
      maybeWriteFileSync(
        path.join(destinationDir, `${entityName}.service.ts`),
        prettify(service.asString())
      );
    }
  });
} catch (err) {
  console.error("ERROR", err);
}

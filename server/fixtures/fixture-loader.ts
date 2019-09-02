import typeOrmConfig from "../src/typeorm-config";
import * as commander from "commander";
import { createConnection, getManager, getRepository } from "typeorm";

import FixtureRegistry from "./fixture-registry";
import EntityMetadataRegistry from "./entity-metadata";

import Debug from "debug";
import { AbstractEntity } from "../src/shared/abstract-entity";

const debug = Debug("fixture-loader");

// Represent a newly-inserted value in the database as a strong.
function dbValueToString(dbValue) {
  const fields: string[] = [];
  let id = -1; // Keep this separate so it always shows up first.

  for (const [key, value] of Object.entries(dbValue)) {
    if (key === "id" && typeof value === "number") {
      id = value;
    } else {
      fields.push(`${key}: ${value}`);
    }
  }

  fields.sort();
  fields.unshift(`id: ${id}`);
  return `${dbValue.constructor.name}(${fields.join(", ")})`;
}

/**
 * DANGER: Remove all the rows from the named table and any tables that have foreign keys to it.
 * @param tableName - Table to truncate
 */
function truncateTable(tableName: string) {
  return getManager().query(`TRUNCATE TABLE ${tableName} CASCADE`);
}

async function main(argv) {
  const program = new commander.Command();
  program
    .version("0.2")
    .usage("[options] <fixtureName ...>")
    .option(
      "-f, --fixture-dir <directory>",
      "location of fixtures (default `./fixtures`)",
      "./fixtures"
    )
    .option("-l, --list-fixtures", "list available fixtures")
    .option("-a, --all-fixtures", "load all fixtures")
    .option("-t, --truncate", "truncate tables before loading fixtures")
    .option(
      "-n, --nuclear",
      "nuke and reload everything (same as '--all-fixtures --truncate')"
    )
    .option("-d, --dump-metadata", "dump all metadata and exit")
    .option("-v, --verbose", "output lots of details", false)
    .parse(argv);

  const fixtureRegistry = new FixtureRegistry(program.fixtureDir);

  if (program.listFixtures) {
    // Show a list of fixtures with their unique names and exit.
    for (let tableName of fixtureRegistry.allRegisteredTables()) {
      console.log(tableName);
    }
    process.exit(0);
  }

  // Interpret the nuclear option.
  if (program.nuclear) {
    program.allFixtures = program.truncate = true;
  }

  // Set up the database direct connection.
  const connectionOptions = { ...typeOrmConfig };
  if (program.verbose) {
    connectionOptions.logging = true;
  }
  const dbConnection = await createConnection(connectionOptions);

  const metadataRegistry = new EntityMetadataRegistry();

  if (program.dumpMetadata) {
    for (const metadata of metadataRegistry.allEntityMetadata()) {
      console.log(metadata);
    }
    process.exit(0);
  }

  // Make sure the user asked us to do something.
  if (!(program.args.length || program.allFixtures)) {
    console.error("No fixtures specified; nothing to do!");
    process.exit(1);
  }

  // Set of all features requested.
  const tablesFromCommandLine = new Set(program.args);

  // List tables to process. Tables listed in topographic order
  // according to dependencies between tables.
  const namesOfTablesToProcess = fixtureRegistry
    .allFixturesInOrder()
    .filter(
      fixture =>
        program.allFixtures || tablesFromCommandLine.has(fixture.tableName)
    )
    .map(fixture => fixture.tableName);

  // Truncate tables, if requested. Do these all up front, rather than
  // during fixture loading, which could cause previous updates to be lost.
  if (program.truncate) {
    for (const tableName of namesOfTablesToProcess) {
      console.log(`Truncate table '${tableName}'`);
      await truncateTable(tableName);
    }
  }

  // Load the fixtures requested.
  for (const tableName of namesOfTablesToProcess) {
    const entityMetadata = metadataRegistry.findEntityMetadata(tableName);
    const fixture = fixtureRegistry.findFixture(tableName);
    debug("Table %s for entity %s", tableName, entityMetadata.entityName);

    // Because we're fetching a repository for this entity at run time,
    // it's too late for the type system to make use of the `Entity` type
    // throughout this portion of code. Essentially, we end up with a
    // repository of type `Repository<unknown>`.
    // Solution: pass a type parameter explicitly.
    const repository = getRepository<AbstractEntity>(entityMetadata.target);

    for (const fixtureRow of fixture.rows) {
      // Load a single row.
      const newEntity = repository.create();

      for (const fixtureColumn of fixtureRow.columns) {
        const adjustedColumnName = entityMetadata.adjustedColumnName(
          fixtureColumn.name
        );

        if (fixtureColumn.hasForeignKeyDescriptor()) {
          // Column is a foreign key
          const foreignKeyDescriptor = fixtureColumn.decodeForeignKeyDescriptor();

          let foreignRow;
          try {
            foreignRow = fixtureRegistry.findRowFromForeignKey(
              foreignKeyDescriptor
            );
          } catch (err) {
            console.log(`Loading table '${tableName}'`);
            throw err;
          }

          if (!foreignRow) {
            throw new Error(
              `No row with foreign key '${foreignKeyDescriptor}'`
            );
          }
          newEntity[adjustedColumnName] = foreignRow.databaseId;
        } else {
          // Column is a normal value.
          let columnValue = fixtureColumn.value;
          const columnType = entityMetadata.columnType(adjustedColumnName);

          if (typeof columnValue === "string") {
            if (columnType === "number") {
              columnValue = parseInt(columnValue);
            }
          }

          newEntity[adjustedColumnName] = columnValue;
        }
      }

      const dbValue = await repository.save(newEntity);
      fixtureRow.databaseId = dbValue.id;
      console.log("Loaded", dbValueToString(dbValue));
    }
  }

  // Close the connection to the database.
  return await dbConnection.close();
}

main(process.argv)
  .then(() => debug("Complete"))
  .catch(err => console.error(err));

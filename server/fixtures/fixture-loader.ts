import typeOrmConfig from "../src/typeorm-config";
import * as commander from "commander";
import { createConnection, getManager, getRepository } from "typeorm";

import FixtureRegistry from "./fixture-registry";
import EntityMetadataRegistry from "./entity-metadata";

import Debug from "debug";
import { AbstractEntity } from "../src/shared/abstract-entity";

const debug = Debug("fixture-loader");

/**
 * DANGER: Remove all the rows from the named table and any tables that have foreign keys to it.
 * @param tableName - Table to truncate
 */
export function truncateTable(tableName: string) {
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

  // Make sure the user asked us to do something.
  if (!(program.args.length || program.allFixtures)) {
    console.error("No fixtures provided; nothing to do!");
    process.exit(1);
  }

  // Set up the database direct connection.
  const connectionOptions = { ...typeOrmConfig };
  if (program.verbose) {
    connectionOptions.logging = true;
  }
  const connection = await createConnection(connectionOptions);

  const metadataRegistry = new EntityMetadataRegistry();

  // Set of all features requested.
  const argsSet = new Set(program.args);

  // Iterate over all fixtures and execute the one(s) requested.
  // Fixtures returned by `allFixtures` are in topographic order
  // according to dependencies between tables.
  for (const fixture of fixtureRegistry.allFixturesInOrder()) {
    if (program.allFixtures || argsSet.has(fixture.tableName)) {
      // Load this fixture.

      if (program.truncate) {
        // Truncate table.
        console.log(`Truncating table '${fixture.tableName}'`);
        await truncateTable(fixture.tableName);
      }

      const entityMetadata = metadataRegistry.findEntityMetadata(
        fixture.tableName
      );
      debug(
        "Table %s for entity %s",
        fixture.tableName,
        entityMetadata.entityName
      );

      // Because we're fetching a repository for this entity at run time,
      // it's too late for the type system to make use of the `Entity` type
      // throughout this portion of code. Essentially, we end up with a
      // repository of type `Repository<unknown>`.
      // Solution: pass a type parameter explicitly.
      const repository = getRepository<AbstractEntity>(entityMetadata.target);

      for (const fixtureRow of fixture.rows) {
        const newEntity = repository.create();

        for (const fixtureColumn of fixtureRow.columns) {
          if (entityMetadata.hasColumn(fixtureColumn.name)) {
            if (fixtureColumn.hasForeignKeyDescriptor()) {
              // Column is a foreign key
              const foreignKeyDescriptor = fixtureColumn.decodeForeignKeyDescriptor();
              const foreignRow = fixtureRegistry.findRow(foreignKeyDescriptor);
              if (!foreignRow) {
                throw new Error(
                  `No row with foreign key '${foreignKeyDescriptor}'`
                );
              }
              const foreignKey = foreignRow.databaseId;
              newEntity[fixtureColumn.name] = foreignKey;
            } else {
              // Column is a normal value.
              let columnValue = fixtureColumn.value;
              const columnType = entityMetadata.columnType(fixtureColumn.name);

              if (typeof columnValue === "string") {
                if (columnType === "number") {
                  columnValue = parseInt(columnValue);
                }
              }

              newEntity[fixtureColumn.name] = columnValue;
            }
          } else {
            throw new Error(
              `No column called '${fixtureColumn.name}' in '${entityMetadata.entityName}'`
            );
          }
        }

        const dbValue = await repository.save(newEntity);
        fixtureRow.databaseId = dbValue.id;
      }
    }
  }

  // Close the connection to the database.
  return await connection.close();
}

main(process.argv)
  .then(() => debug("Complete"))
  .catch(err => console.error(`Something bad happened: ${err}`));

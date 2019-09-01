import typeOrmConfig from "../src/typeorm-config";
import * as commander from "commander";
import { createConnection, getManager, getRepository } from "typeorm";

import FixtureRegistry from "./fixture-registry";
import EntityMetadataRegistry from "./entity-metadata";

import Debug from "debug";
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
  const connection = await createConnection({
    ...typeOrmConfig,
    logging: true
  });

  const metadataRegistry = new EntityMetadataRegistry();

  // Set of all features requested.
  const argsSet = new Set(program.args);

  // Iterate over all fixtures and execute the one(s) requested.
  for (let [tableName, fixture] of fixtureRegistry.allFixtures()) {
    if (program.allFixtures || argsSet.has(tableName)) {
      // Run this fixture.

      if (program.truncate) {
        // Truncate table.
        console.log(`Truncating table '${tableName}'`);
        await truncateTable(tableName);
      }

      const entityName = metadataRegistry.lookUpEntityName(tableName);
      const repository = getRepository(entityName);

      debug("Table %s for entity %s", tableName, entityName);

      for (const row of fixture.rows) {
        const newEntity = repository.create();
        for (const column of row.columns) {
          newEntity[column.name] = column.value;
        }
        debug("entityName %O", newEntity);
        await repository.save(newEntity);
      }
    }
  }

  // Close the connection to the database.
  await connection.close();
}

main(process.argv);

import ApolloClient from "apollo-boost";
import fetch from "node-fetch";
import { Fixture } from "./fixture.types";
import get from "lodash/get";
import commander from "commander";
import typeOrmConfig from "../src/typeorm-config";

import termFixtures from "./calendar.fixtures";
import topicFixtures from "./syllabus.fixtures";
import prefixFixtures from "./org.fixtures";
import catalogFixtures from "./catalog.fixtures";
import { createConnection, getConnection, getManager } from "typeorm";
import { AbstractEntity } from "src/shared/abstract-entity";
import {truncateTable} from "./db-helpers";
const allFixtures: Fixture[] = [
  ...termFixtures,
  ...topicFixtures,
  ...prefixFixtures,
  ...catalogFixtures
];

/**
 * Use `gqlClient` to run the mutation configured in `fixture`.
 * @param gqlClient - GraphQL gqlClient
 * @param fixture - Fixture structure.
 */
async function mutate(gqlClient, fixture: Fixture) {
  console.log(`Loading ${fixture.description}`);
  for (const datum of fixture.graphQlData) {
    console.log("  ", get(datum, fixture.idPath));
    try {
      const result = await gqlClient.mutate({
        mutation: fixture.graphQlMutation,
        variables: {
          data: datum
        }
      });
    } catch (err) {
      console.log("ERROR", err);
      throw err;
    }
  }
}

/**
 * Make sure the names of fixtures are unique.
 * @param fixtures - Fixtures to validate.
 */
function validateUniqueFixtureNames(fixtures: Fixture[]) {
  const fixtureNames = new Set();
  let foundError = false;

  for (const fixture of fixtures) {
    if (fixtureNames.has(fixture.uniqueName)) {
      console.error(`Multiple fixtures use the name ${fixture.uniqueName}`);
      foundError = true;
    }
    fixtureNames.add(fixture.uniqueName);
  }

  if (foundError) {
    process.exit(1);
  }
}

/**
 * Check that the `args` (from the command line) name valid fixtures.
 * @param fixtures - All the fixtures
 * @param args - command line arguments
 */
function validateFixtureArguments(fixtures: Fixture[], args: string[]) {
  const fixtureNames = new Set(fixtures.map(fixture => fixture.uniqueName));
  const bogusArgs = args.filter(arg => !fixtureNames.has(arg));
  if (bogusArgs.length) {
    console.error(`Bogus fixture names: ${bogusArgs.join(", ")}`);
    process.exit(1);
  }
}

async function main(argv) {
  validateUniqueFixtureNames(allFixtures);

  const program = new commander.Command();
  program
    .version("0.1")
    .usage("[options] <fixtureName ...>")
    .option("-l, --list-fixtures", "list available fixtures")
    .option("-a, --all-fixtures", "load all fixtures")
    .option("-t, --truncate", "truncate tables before loading fixtures")
    .option(
      "-n, --nuclear",
      "nuke and reload everything (same as '--all-fixtures --truncate')"
    )
    .parse(argv);

  validateFixtureArguments(allFixtures, program.args);

  if (program.listFixtures) {
    // Show a list of fixtures with their unique names and exit.
    allFixtures.forEach(fixture =>
      console.log(`${fixture.uniqueName} - ${fixture.description}`)
    );
    process.exit(0);
  }

  // Interpret the nuclear option.
  if (program.nuclear) {
    program.allFixtures = program.truncate = true;
  }

  if (!(program.args.length || program.allFixtures)) {
    console.error("No fixtures provided");
    process.exit(1);
  }

  // Set up the GraphQL client.
  const gqlClient = new ApolloClient({
    uri: "http://localhost:3000/graphql",
    fetch: fetch
  });

  // Set up the database direct connection.
  await createConnection({
    ...typeOrmConfig
    // logging: true
  });

  const args = new Set(program.args);
  // Check each fixture.
  for (let fixture of allFixtures) {
    if (program.allFixtures || args.has(fixture.uniqueName)) {
      // Run this one.
      if (program.truncate) {
        // Truncate tables.
        for (const tableName of fixture.tablesToTruncate) {
          console.log(`Truncating table '${tableName}'`);
          await truncateTable(tableName);
        }
      }
      // Run the mutation.
      await mutate(gqlClient, fixture);
    }
  }

  // Close the connection to the database.
  await getConnection().close();
}

main(process.argv);

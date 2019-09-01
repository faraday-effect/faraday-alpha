import * as fs from "fs";
import { safeLoad } from "js-yaml";
import * as path from "path";
import { difference, flatMap, uniq } from "lodash";

import Debug from "debug";
import toposort = require("toposort");

const debug = Debug("fixture-registry");

type tableName = string;

class FixtureColumn {
  private static readonly foreignKeyRegex = /^\^(\w*)\.(\w*)/;

  constructor(public name: string, public value: string | number) {
    if (
      typeof value === "string" &&
      value.startsWith("^") &&
      !FixtureColumn.foreignKeyRegex.test(value)
    ) {
      throw Error(
        `Do you intend '${value}' to be a foreign key? It doesn't match the pattern.`
      );
    }
  }

  isForeignKey() {
    if (typeof this.value === "string") {
      return FixtureColumn.foreignKeyRegex.test(this.value);
    }
    return false;
  }

  decodeForeignKey() {
    if (!this.isForeignKey()) {
      throw Error(`Not a foreign key: ${this.value}`);
    }

    if (typeof this.value === "string") {
      const result = FixtureColumn.foreignKeyRegex.exec(this.value);
      return {
        tableName: result[1],
        rowName: result[2]
      };
    }

    throw Error("Something very weird happened");
  }
}

class FixtureRow {
  private _dbId: number = -1;

  constructor(public rowName: string, public columns: FixtureColumn[]) {}

  listForeignKeys() {
    return this.columns
      .filter(column => column.isForeignKey())
      .map(column => column.decodeForeignKey());
  }

  listColumnNames() {
    return this.columns.map(column => column.name);
  }

  get databaseId() {
    if (this._dbId <= 0) {
      throw new Error(`No database ID for '${this.rowName}'`);
    }
    return this._dbId;
  }

  set databaseId(value: number) {
    if (this._dbId > 0) {
      throw new Error(`Already have a database ID for '${this.rowName}'`);
    }
    this._dbId = value;
    debug(`Set DB ID to ${value} on ${this.rowName}`);
  }
}

class Fixture {
  constructor(public tableName: string, public rows: FixtureRow[]) {}

  listForeignKeys() {
    return flatMap(this.rows, row => row.listForeignKeys());
  }

  listForeignTableNames() {
    return uniq(this.listForeignKeys().map(fk => fk.tableName));
  }

  findRow(rowName: string) {
    const row = this.rows.find(row => row.rowName == rowName);
    if (!row) {
      throw new Error(
        `No row called '${rowName}' in '${this.tableName}' fixture `
      );
    }
    return row;
  }
}

export default class FixtureRegistry {
  private registry = new Map<tableName, Fixture>();

  constructor(baseDir) {
    const yamlFileNames = fs
      .readdirSync(baseDir)
      .filter(name => name.endsWith(".fixtures.yaml"));

    yamlFileNames.forEach(yamlFileName => {
      console.log(`LOADING ${yamlFileName}`);
      const doc = safeLoad(
        fs.readFileSync(path.join(baseDir, yamlFileName), "utf8")
      );

      for (const fixture of doc.fixtures) {
        debug("TABLE %s", fixture.table);
        const fixtureObject = new Fixture(fixture.table, []);
        for (const [rowName, columns] of Object.entries(fixture.rows)) {
          debug("\tROW %s", rowName);
          const fixtureRow = new FixtureRow(rowName, []);
          fixtureObject.rows.push(fixtureRow);
          for (const [colName, colValue] of Object.entries(columns)) {
            debug("\t\tCOL %s %s", colName, colValue);
            fixtureRow.columns.push(new FixtureColumn(colName, colValue));
          }
        }
        this.registry.set(fixture.table, fixtureObject);
        debug("FOREIGN KEYS %O", fixtureObject.listForeignKeys());
        debug("FOREIGN TABLES %O", fixtureObject.listForeignTableNames());
      }
    });
    debug("FIXTURE REGISTRY %O", this.registry);
    this.fixtureCreationOrder();
  }

  findFixture(tableName: string): Fixture {
    const fixture = this.registry.get(tableName);
    if (fixture) {
      return fixture;
    }
    throw new Error(`Can't find fixture for table '${tableName}'`);
  }

  findRow(tableName: string, rowName: string) {
    this.findFixture(tableName).findRow(rowName);
  }

  allFixturesInOrder() {
    const orderedFixtures: Fixture[] = [];

    for (const tableName of this.fixtureCreationOrder()) {
      orderedFixtures.push(this.findFixture(tableName));
    }

    return orderedFixtures;
  }

  allRegisteredTables() {
    return this.registry.keys();
  }

  hasTable(tableName: string) {
    return this.registry.has(tableName);
  }

  fixtureCreationOrder() {
    const graph = [];
    for (const fixture of this.registry.values()) {
      for (const foreignTableName of fixture.listForeignTableNames()) {
        graph.push([fixture.tableName, foreignTableName]);
      }
    }

    const sortedFixtures = toposort(graph).reverse();
    const remainingFixtures = difference(
      Array.from(this.registry.keys()),
      sortedFixtures
    );
    debug(
      "GRAPH %O SORTED %O REMAINING %O",
      graph,
      sortedFixtures,
      remainingFixtures
    );
    return sortedFixtures.concat(remainingFixtures);
  }
}

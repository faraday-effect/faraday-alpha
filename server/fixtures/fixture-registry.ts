import * as fs from "fs";
import { safeLoad } from "js-yaml";
import * as path from "path";

import Debug from "debug";
const debug = Debug("fixture-registry");

type tableName = string;

class FixtureColumn {
  constructor(public name: string, public value: string | number) {}
}

class FixtureRow {
  constructor(public rowName: string, public columns: FixtureColumn[]) {}
}

class Fixture {
  constructor(public tableName: string, public rows: FixtureRow[]) {}
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
      }
    });
    debug("FIXTURE REGISTRY %O", this.registry);
  }

  allFixtures() {
    return this.registry.entries();
  }

  allRegisteredTables() {
    return this.registry.keys();
  }

  hasTable(tableName: string) {
    return this.registry.has(tableName);
  }
}

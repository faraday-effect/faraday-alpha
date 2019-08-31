import { createConnection, getConnection, getManager } from "typeorm";
import typeOrmConfig from "../src/typeorm-config";

/**
 * This class provides direct access to the database in order to do destructive things
 * (like truncating tables). This approach avoids putting _really_ dangerous functionality
 * in the GraphQL API.
 */
export default class DbDirect {
  openConnection() {
    return createConnection({
      ...typeOrmConfig
    });
  }

  closeConnection() {
    return getConnection().close();
  }

  /**
   * Remove all the rows from the named table and any tables that have foreign keys to it.
   * This is _really_ dangerous!
   * @param tableName - Table to truncate
   */
  truncateTable(tableName: string) {
    return getManager().query(`TRUNCATE TABLE ${tableName} CASCADE`);
  }
}

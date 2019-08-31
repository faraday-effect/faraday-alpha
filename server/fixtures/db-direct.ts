import { createConnection, getConnection, getManager } from "typeorm";
import typeOrmConfig from "../src/typeorm-config";


export default class DbDirect {
  openConnection() {
    return createConnection({
      ...typeOrmConfig
    });
  }

  closeConnection() {
    return getConnection().close();
  }

  truncateTable(tableName: string) {
    return getManager().query(`TRUNCATE TABLE ${tableName} CASCADE`);
  }
}

// These functions assume there is already a valid TypeORM database connection!

import { getManager } from "typeorm";
import { AbstractEntity } from "../src/shared/abstract-entity";

/**
 * Remove all the rows from the named table and any tables that have foreign keys to it.
 * This is _really_ dangerous!
 * @param tableName - Table to truncate
 */
export function truncateTable(tableName: string) {
  return getManager().query(`TRUNCATE TABLE ${tableName} CASCADE`);
}

export async function foreignInstanceId(entity, findOneOptions) {
  const instance: AbstractEntity = await getManager().findOneOrFail(
    entity,
    findOneOptions
  );
  return instance.id;
}

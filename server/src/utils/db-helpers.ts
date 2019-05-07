import { Repository } from "typeorm";

/**
 * Database-helper functions.
 * Isolate database-specific code here.
 */

/**
 * Truncate a table and all tables having foreign keys to it.
 * @param repository Repository object
 * @param name Table name
 */
export function truncateTable<T>(repository: Repository<T>, name: string) {
  return repository.query(`TRUNCATE TABLE ${name} CASCADE`);
}

import { ColumnType, getConnection } from "typeorm";

import Debug from "debug";
const debug = Debug("entity-metadata");

type tableName = string;

class ColumnMetadata {
  constructor(
    public name: string,
    public databaseName: string,
    public type: string,
    public nullable: boolean
  ) {}

  toString() {
    return `${this.name}: ${this.type} (${
      this.nullable ? "" : "not "
    } nullable)`;
  }
}

class EntityMetadata {
  constructor(
    public entityName: string,
    public tableName: string,
    public target: string | Function,
    public columns: ColumnMetadata[]
  ) {}

  toString() {
    return `${this.tableName} for ${this.entityName}
    ${this.columns}
    `;
  }

  // Deal with the possibility that we ask for a column called `foo`
  // but there is actually one called `fooId`.
  adjustedColumnName(columnName: string) {
    const candidates = [columnName, columnName + "Id"];
    for (const candidate of candidates) {
      if (this.hasColumn(candidate)) {
        return candidate;
      }
    }

    throw new Error(
      `Can't find column '${columnName}' in ${
        this.entityName
      }; tried ${candidates.map(candidate => `'${candidate}'`).join(", ")}`
    );
  }

  hasColumn(columnName: string) {
    return this.findColumn(columnName) !== undefined;
  }

  findColumn(columnName: string) {
    return this.columns.find(column => column.name === columnName);
  }

  columnType(columnName: string) {
    return this.findColumn(columnName).type;
  }
}

export default class EntityMetadataRegistry {
  private registry = new Map<tableName, EntityMetadata>();

  constructor() {
    const connection = getConnection();

    for (let entityMetadata of connection.entityMetadatas) {
      const columnMetadata: ColumnMetadata[] = [];

      for (let column of entityMetadata.columns) {
        columnMetadata.push(
          new ColumnMetadata(
            column.propertyName,
            column.databaseName,
            EntityMetadataRegistry.stringifyColumnType(column.type),
            column.isNullable
          )
        );
      }

      this.registry.set(
        entityMetadata.tableName,
        new EntityMetadata(
          entityMetadata.name,
          entityMetadata.tableName,
          entityMetadata.target,
          columnMetadata
        )
      );
    }
    debug("METADATA REGISTRY %O", this.registry);
  }

  private static stringifyColumnType(columnType: ColumnType): string {
    if (typeof columnType === "function") {
      return columnType.name.toLowerCase();
    } else {
      return columnType;
    }
  }

  findEntityMetadata(tableName: string) {
    return this.registry.get(tableName);
  }

  allEntityMetadata() {
    return this.registry.values();
  }
}

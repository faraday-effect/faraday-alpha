import { ColumnType, getConnection } from "typeorm";

import Debug from "debug";
const debug = Debug("entity-metadata");

type tableName = string;

class ColumnMetadata {
  constructor(
    public name: string,
    public type: string,
    public nullable: boolean
  ) {}
}

class EntityMetadata {
  constructor(
    public entityName: string,
    public tableName: string,
    public target: string | Function,
    public columns: ColumnMetadata[]
  ) {}

  listColumnNames() {
    return this.columns.map(column => column.name);
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
}

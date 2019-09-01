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
    public columns: ColumnMetadata[]
  ) {}
}

export default class EntityMetadataRegistry {
  private registry = new Map<tableName, EntityMetadata>();

  constructor() {
    const connection = getConnection();

    for (let entity of connection.entityMetadatas) {
      const columnMetadata: ColumnMetadata[] = [];

      for (let column of entity.columns) {
        columnMetadata.push(
          new ColumnMetadata(
            column.propertyName,
            EntityMetadataRegistry.stringifyColumnType(column.type),
            column.isNullable
          )
        );
      }

      this.registry.set(
        entity.tableName,
        new EntityMetadata(entity.name, entity.tableName, columnMetadata)
      );
    }
    debug("METADATA REGISTRY %O", this.registry);
  }

  static stringifyColumnType(columnType: ColumnType): string {
    if (typeof columnType === "function") {
      return columnType.name.toLowerCase();
    } else {
      return columnType;
    }
  }

  lookUpEntityName(tableName: string) {
    return this.registry.get(tableName).entityName;
  }

  find(tableName: string) {
    return this.registry.get(tableName);
  }
}

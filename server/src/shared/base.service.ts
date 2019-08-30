import { EntityManager, FindConditions, ObjectType } from "typeorm";
import { AbstractEntity } from "./abstract-entity";

export class BaseService {
  constructor(protected readonly entityManager: EntityManager) {}

  readOne(entity: ObjectType<AbstractEntity>, id: number) {
    return this.entityManager.findOne(entity, id);
  }

  readAll(entity: ObjectType<AbstractEntity>) {
    return this.entityManager.find(entity);
  }

  findOne<Entity>(entityClass: ObjectType<Entity>, id: number) {
    return this.entityManager.findOne(entityClass, id);
  }

  findOneOrFail<Entity>(entityClass: ObjectType<Entity>, id: number) {
    return this.entityManager.findOneOrFail(entityClass, id);
  }

  find<Entity>(
    entityClass: ObjectType<Entity>,
    conditions: FindConditions<Entity>
  ) {
    return this.entityManager.find(entityClass, conditions);
  }
}

import { EntityManager, FindConditions, ObjectType, Repository } from "typeorm";
import { AbstractEntity } from "./abstract-entity";
import { validate } from "class-validator";

export class BaseService {
  constructor(protected readonly entityManager: EntityManager) {}

  async validateAndSave(entity: AbstractEntity) {
    const errors = await validate(entity);
    if (errors.length) {
      throw new Error(errors.toString());
    } else {
      return this.entityManager.save(entity);
    }
  }

  readOne(entity: ObjectType<AbstractEntity>, id: number) {
    return this.entityManager.findOne(entity, id);
  }

  readAll(entity: ObjectType<AbstractEntity>) {
    return this.entityManager.find(entity);
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

  delete<Entity>(entityClass: ObjectType<Entity>, id: number) {
    return this.entityManager.delete(entityClass, id);
  }
}

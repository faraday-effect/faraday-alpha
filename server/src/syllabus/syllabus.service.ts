import { Injectable } from "@nestjs/common";
import { EntityManager } from "typeorm";
import { BaseService } from "../shared/base.service";
import { Unit, UnitCreateInput, Topic } from "./entities";

@Injectable()
export class SyllabusService extends BaseService {
  constructor(protected readonly entityManager: EntityManager) {
    super(entityManager);
  }

  createUnit(createInput: UnitCreateInput) {
    return this.entityManager.transaction(async manager => {
      const unitRepo = manager.getRepository(Unit);
      const topicRepo = manager.getRepository(Topic);

      const newUnit = await unitRepo.save(unitRepo.create(createInput));

      for (const topic of createInput.topics) {
        await topicRepo.save(
          topicRepo.create({
            ...topic,
            unit: newUnit
          })
        );
      }

      return newUnit;
    });
  }
}

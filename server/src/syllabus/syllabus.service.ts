import { Injectable } from "@nestjs/common";
import { EntityManager, Repository } from "typeorm";
import { BaseService } from "../shared/base.service";
import { Unit, UnitCreateInput, Topic, TopicCreateInput } from "./entities";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class SyllabusService extends BaseService {
  constructor(
    protected readonly entityManager: EntityManager,
    @InjectRepository(Unit) private readonly unitRepo: Repository<Unit>,
    @InjectRepository(Topic) private readonly topicRepo: Repository<Topic>
  ) {
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

  // async createTopic(createInput: TopicCreateInput) {
  //   const unit = await this.unitRepo.findOneOrFail(createInput.unitId);
  //   return this.topicRepo.save(this.topicRepo.create(createInput));
  // }
}

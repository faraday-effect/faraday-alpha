import { Injectable } from "@nestjs/common";
import { EntityManager, Repository } from "typeorm";
import { BaseService } from "../shared/base.service";
import {
  Course,
  CourseCreateInput,
  Offering,
  Section,
  SectionCreateInput
} from "./entities";
import { InjectRepository } from "@nestjs/typeorm";
import { Department, Prefix } from "../org/entities";
import { Term } from "../calendar/entities";
import { validate } from "class-validator";

@Injectable()
export class CatalogService extends BaseService {
  constructor(
    protected readonly entityManager: EntityManager,
    @InjectRepository(Course) private readonly courseRepo: Repository<Course>,
    @InjectRepository(Section) private readonly sectionRepo: Repository<Section>
  ) {
    super(entityManager);
  }

  async createCourse(createInput: CourseCreateInput) {
    const department = await this.entityManager.findOneOrFail(
      Department,
      createInput.departmentId
    );
    const prefix = await this.entityManager.findOneOrFail(
      Prefix,
      createInput.prefixId
    );

    return this.courseRepo.save(
      this.courseRepo.create({ ...createInput, department, prefix })
    );
  }

  async createSection(createInput: SectionCreateInput) {
    const offering = await this.entityManager.findOneOrFail(
      Offering,
      createInput.offeringId
    );

    const newSection = this.sectionRepo.create({
      ...createInput,
      offering
    });

    return this.validateAndSave(newSection);
  }
}
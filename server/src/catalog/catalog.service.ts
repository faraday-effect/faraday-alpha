import { Injectable } from "@nestjs/common";
import { EntityManager, Repository } from "typeorm";
import { BaseService } from "../shared/base.service";
import { Course, CourseCreateInput } from "./entities";
import { InjectRepository } from "@nestjs/typeorm";
import { Department, Prefix } from "../org/entities";

@Injectable()
export class CatalogService extends BaseService {
  constructor(
    protected readonly entityManager: EntityManager,
    @InjectRepository(Course) private readonly courseRepo: Repository<Course>
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
}

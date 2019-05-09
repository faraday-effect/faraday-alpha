// ----- COURSE SERVICE -----

import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import {
  Course,
  CourseCreateInput,
  CourseWhereUniqueInput,
  CourseWhereInput,
  CourseOrderByInput,
  CourseUpdateInput
} from "./course.entity";
import { Department } from "../department/department.entity";
import { Prefix } from "../prefix/prefix.entity";

@Injectable()
export class CourseService {
  constructor(
    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,
    @InjectRepository(Department)
    private readonly departmentRepository: Repository<Department>,
    @InjectRepository(Prefix)
    private readonly prefixRepository: Repository<Prefix>
  ) {}

  // Create
  async create(data: CourseCreateInput) {
    // Fetch the actual department and prefix
    const department = await this.departmentRepository.findOneOrFail(
      data.departmentId
    );
    const prefix = await this.prefixRepository.findOneOrFail(data.prefixId);

    // Create initial course with required fields.
    const newCourse = this.courseRepository.create({
      title: data.title,
      number: data.number,
      department,
      prefix
    });

    // Save everything.
    return await this.courseRepository.save(newCourse);
  }

  async upsertCourse(args: {
    where: CourseWhereUniqueInput;
    create: CourseCreateInput;
    update: CourseUpdateInput;
  }) {}

  // Read
  async course(where: CourseWhereUniqueInput) {
    return await this.courseRepository.findOne(where, {
      relations: ["department"]
    });
  }

  async courses(args?: {
    where?: CourseWhereInput;
    orderBy?: CourseOrderByInput;
    skip?: number;
    take?: number;
  }) {
    if (args) {
      return await this.courseRepository.find({
        where: args.where,
        relations: ["department"]
      });
    } else {
      return await this.courseRepository.find({ relations: ["department"] });
    }
  }

  // Update
  async updateCourse(args: {
    data: CourseUpdateInput;
    where: CourseWhereUniqueInput;
  }) {}

  async updateManyCourses(args: {
    data: CourseUpdateInput;
    where?: CourseWhereInput;
  }) {}

  // Delete
  async deleteCourse(where: CourseWhereUniqueInput) {}

  async deleteManyCourses(where?: CourseWhereInput) {}
}

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

@Injectable()
export class CourseService {
  constructor(
    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>
  ) {}

  // Create
  async createCourse(data: CourseCreateInput) {
    const newCourse = this.courseRepository.create(data);
    return await this.courseRepository.save(newCourse);
  }

  async upsertCourse(args: {
    where: CourseWhereUniqueInput;
    create: CourseCreateInput;
    update: CourseUpdateInput;
  }) {}

  // Read
  async course(where: CourseWhereUniqueInput) {
    return await this.courseRepository.findOne(where);
  }

  async courses(args?: {
    where?: CourseWhereInput;
    orderBy?: CourseOrderByInput;
    skip?: number;
    take?: number;
  }) {
    if (args) {
      return await this.courseRepository.find(args.where);
    } else {
      return await this.courseRepository.find();
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

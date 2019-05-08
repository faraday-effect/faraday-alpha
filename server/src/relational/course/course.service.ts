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

@Injectable()
export class CourseService {
  constructor(
    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,
    @InjectRepository(Department)
    private readonly departmentRepository: Repository<Department>
  ) {}

  // Create
  async create(data: CourseCreateInput) {
    const newCourse = this.courseRepository.create({
      title: data.title,
      number: data.number
    });

    if (data.departmentId) {
      const existingDepartment = await this.departmentRepository.findOne(
        data.departmentId
      );
      if (existingDepartment) {
        newCourse.department = existingDepartment;
      } else {
        throw new Error(
          `No department with ID ${data.departmentId} while creating course ${
            data.title
          }`
        );
      }
    }

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

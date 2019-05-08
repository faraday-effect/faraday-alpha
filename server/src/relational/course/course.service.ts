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
    // Create initial course with required fields.
    const newCourse = this.courseRepository.create({
      title: data.title,
      number: data.number
    });

    // Handle optional department.
    if (data.departmentId) {
      const existingDepartment = await this.departmentRepository.findOne(
        data.departmentId
      );
      if (existingDepartment) {
        // Add the requested department to the new course.
        newCourse.department = existingDepartment;
      } else {
        // No such department.
        throw new Error(
          `No department with ID ${data.departmentId} while creating course ${
            data.title
          }`
        );
      }
    }

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

import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, FindManyOptions } from "typeorm";
import { Course, CourseCreateInput, CourseWhereInput } from "./course.entity";

@Injectable()
export class CourseService {
  constructor(
    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>
  ) {}

  // Create
  async createCourse(data: CourseCreateInput) {
    const newCourse = this.courseRepository.create({
      number: data.number,
      title: data.title
    });
    return await this.courseRepository.save(newCourse);
  }

  // Read
  async course(id: number) {
    return await this.courseRepository.findOne(id);
  }

  async courses(where?: CourseWhereInput) {
    let options: CourseWhereInput = {};

    return await this.courseRepository.find(options);
  }
}

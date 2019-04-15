import { Injectable, Body } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Course } from "./course.entity";
import { CreateCourseDto } from "./dto/create-course.dto";
import { Department } from "../department/department.entity";

@Injectable()
export class CourseService {
  constructor(
    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,
    @InjectRepository(Department)
    private readonly deptRepository: Repository<Department>
  ) {}

  async create(createCourseDto: CreateCourseDto): Promise<Course> {
    const existingDepartment = await this.deptRepository.findOne(
      createCourseDto.departmentId
    );
    const newCourse = this.courseRepository.create({
      number: createCourseDto.number,
      title: createCourseDto.title,
      department: existingDepartment
    });
    return await this.courseRepository.save(newCourse);
  }

  async readAll(): Promise<Course[]> {
    return await this.courseRepository.find();
  }

  async find(args: object): Promise<Course[]> {
    return await this.courseRepository.find(args);
  }
}

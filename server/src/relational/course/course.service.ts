import { Injectable, Body } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CourseEntity } from "./course.entity";
import { CreateCourseDto } from "./dto/create-course.dto";
import { DepartmentEntity } from "../department/department.entity";

@Injectable()
export class CourseService {
  constructor(
    @InjectRepository(CourseEntity)
    private readonly courseRepo: Repository<CourseEntity>,
    @InjectRepository(DepartmentEntity)
    private readonly deptRepo: Repository<DepartmentEntity>
  ) {}

  async create(createCourseDto: CreateCourseDto): Promise<CourseEntity> {
      const deptartment = await this.deptRepo.findOne(createCourseDto.departmentId);
      const newCourse = this.courseRepo.create({
          number: createCourseDto.number,
          title: createCourseDto.title,
          department: deptartment
      })
    return await this.courseRepo.save(newCourse);
  }

  async findAll(): Promise<CourseEntity[]> {
    return await this.courseRepo.find();
  }
}

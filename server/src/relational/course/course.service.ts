import { Injectable, Body } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CourseEntity } from "./course.entity";
import { CreateCourseDto } from "./dto/create-course.dto";

@Injectable()
export class CourseService {
  constructor(
    @InjectRepository(CourseEntity)
    private readonly repo: Repository<CourseEntity>
  ) {}

  async create(createCourseDto: CreateCourseDto): Promise<CourseEntity> {
    const newCourse = this.repo.create(createCourseDto);
    return await this.repo.save(newCourse);
  }

  async findAll(): Promise<CourseEntity[]> {
    return await this.repo.find();
  }
}

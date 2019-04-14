import { Controller, Get, Post, Body } from "@nestjs/common";
import { CourseService } from "./course.service";
import { CourseEntity } from "./course.entity";
import { CreateCourseDto } from "./dto/create-course.dto";

@Controller("courses")
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @Post()
  create(@Body() createCourseDto: CreateCourseDto) {
    return this.courseService.create(createCourseDto);
  }

  @Get()
  readAll(): Promise<CourseEntity[]> {
    return this.courseService.readAll();
  }
}

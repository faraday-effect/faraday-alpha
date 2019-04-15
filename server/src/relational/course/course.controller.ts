import { Controller, Get, Post, Body } from "@nestjs/common";
import { CourseService } from "./course.service";
import { Course } from "./course.entity";
import { CreateCourseDto } from "./dto/create-course.dto";

@Controller("courses")
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @Post()
  create(@Body() createCourseDto: CreateCourseDto) {
    return this.courseService.create(createCourseDto);
  }

  @Get()
  readAll(): Promise<Course[]> {
    return this.courseService.readAll();
  }
}

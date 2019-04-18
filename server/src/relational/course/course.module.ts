import { Module } from '@nestjs/common';
import { CourseService } from './course.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Course } from './course.entity';
import { Department } from '../department/department.entity';
import { CourseResolver } from './course.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([Course, Department])],
  providers: [CourseService, CourseResolver],
  exports: [CourseService]
})
export class CourseModule {}

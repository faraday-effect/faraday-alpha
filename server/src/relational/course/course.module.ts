import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Department } from '../department/department.entity';
import { Course } from './course.entity';
import { CourseResolver } from './course.resolver';
import { CourseService } from './course.service';

@Module({
  imports: [TypeOrmModule.forFeature([Course, Department])],
  providers: [CourseService, CourseResolver],
  exports: [CourseService]
})
export class CourseModule {}
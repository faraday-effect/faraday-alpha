import { Module } from '@nestjs/common';
import { CourseController } from './course.controller';
import { CourseService } from './course.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Course } from './course.entity';
import { Department } from '../department/department.entity';
import { CourseResolver } from './course.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([Course, Department])],
  controllers: [CourseController],
  providers: [CourseService, CourseResolver],
  exports: [CourseService]
})
export class CourseModule {}

import { Module } from '@nestjs/common';
import { CourseController } from './course.controller';
import { CourseService } from './course.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CourseEntity } from './course.entity';
import { DepartmentEntity } from '../department/department.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CourseEntity, DepartmentEntity])],
  controllers: [CourseController],
  providers: [CourseService]
})
export class CourseModule {}

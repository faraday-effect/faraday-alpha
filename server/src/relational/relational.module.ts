import { Module } from '@nestjs/common';
import { DepartmentModule } from './department/department.module';
import { CourseModule } from './course/course.module';

@Module({
    imports: [DepartmentModule, CourseModule]
})
export class RelationalModule {}

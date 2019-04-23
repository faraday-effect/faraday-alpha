import { Module } from "@nestjs/common";
import { DepartmentModule } from "./department/department.module";
import { CourseModule } from "./course/course.module";
import { ScheduleModule } from "./schedule/schedule.module";

@Module({
  imports: [DepartmentModule, CourseModule, ScheduleModule]
})
export class RelationalModule {}

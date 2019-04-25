import { Module } from "@nestjs/common";
import { DepartmentModule } from "./department/department.module";
import { CourseModule } from "./course/course.module";
import { TermModule } from "./term/term.module";

@Module({
  imports: [DepartmentModule, CourseModule, TermModule]
})
export class RelationalModule {}

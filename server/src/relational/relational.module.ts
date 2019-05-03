import { Module } from "@nestjs/common";
import { DepartmentModule } from "./department/department.module";
import { CourseModule } from "./course/course.module";
import { TermModule } from "./term/term.module";
import { PrefixModule } from "./prefix/prefix.module";

@Module({
  imports: [DepartmentModule, CourseModule, TermModule, PrefixModule]
})
export class RelationalModule {}

import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Department } from "./department.entity";
import { DepartmentService } from "./department.service";
import { DepartmentResolver } from "./department.resolver";
import { CourseModule } from "../course/course.module";
import { CourseService } from "../course/course.service";

@Module({
  imports: [TypeOrmModule.forFeature([Department]), CourseModule],
  providers: [DepartmentService, DepartmentResolver]
})
export class DepartmentModule {}

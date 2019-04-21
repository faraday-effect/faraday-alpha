import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CourseModule } from "../course/course.module";
import { Department } from "./department.entity";
import { DepartmentResolver } from "./department.resolver";
import { DepartmentService } from "./department.service";

@Module({
  imports: [TypeOrmModule.forFeature([Department]), CourseModule],
  providers: [DepartmentService, DepartmentResolver]
})
export class DepartmentModule {}

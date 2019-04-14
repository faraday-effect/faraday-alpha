import { Controller, Get, Post, Body } from "@nestjs/common";
import { DepartmentService } from "./department.service";
import { DepartmentEntity } from "src/relational/department/department.entity";

@Controller("departments")
export class DepartmentController {
  constructor(private readonly departmentService: DepartmentService) {}

  @Get()
  findAll(): Promise<DepartmentEntity[]> {
    return this.departmentService.findAll();
  }

  @Post()
  addDepartment(@Body("name") departmentName: string): Promise<DepartmentEntity> {
    return this.departmentService.addDepartment(departmentName);
  }
}

import { Controller, Get, Post, Body } from "@nestjs/common";
import { DepartmentService } from "./department.service";
import { Department } from "src/relational/department/department.entity";

@Controller("departments")
export class DepartmentController {
  constructor(private readonly departmentService: DepartmentService) {}

  @Get()
  findAll(): Promise<Department[]> {
    return this.departmentService.findAll();
  }

  @Post()
  addDepartment(@Body("name") departmentName: string): Promise<Department> {
    return this.departmentService.addDepartment(departmentName);
  }
}

import { Controller, Get, Post, Body } from "@nestjs/common";
import { DepartmentService } from "./department.service";
import { Department } from "src/department/department.entity";

@Controller("departments")
export class DepartmentController {
  constructor(private readonly departmentService: DepartmentService) {}

  @Get()
  findAll(): Promise<Department[]> {
    return this.departmentService.findAll();
  }

  @Post()
  addDepartment(@Body("name") departmentName: string): Promise<Department> {
    console.log("NAME", departmentName);
    return this.departmentService.addDepartment(departmentName);
  }
}

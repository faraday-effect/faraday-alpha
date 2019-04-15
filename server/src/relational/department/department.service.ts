import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Department } from "./department.entity";
import { Repository } from "typeorm";
import { Course } from "../course/course.entity";

@Injectable()
export class DepartmentService {
  constructor(
    @InjectRepository(Department)
    private readonly departmentRepository: Repository<Department>
  ) {}

  async findAll(): Promise<Department[]> {
    return await this.departmentRepository.find();
  }

  async findOne(id: number): Promise<Department> {
    return await this.departmentRepository.findOne(id);
  }

  async coursesFor(deptId: number): Promise<Course[]> {
    const dept = await this.departmentRepository.findOne(deptId, {
      relations: ["courses"]
    });
    console.log("COURSES", dept.courses);
    return dept.courses;
  }

  async addDepartment(name: string): Promise<Department> {
    const newDepartment = this.departmentRepository.create({ name });
    return await this.departmentRepository.save(newDepartment);
  }
}

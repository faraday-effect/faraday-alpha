import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Department, DepartmentCreateInput } from "./department.entity";

@Injectable()
export class DepartmentService {
  constructor(
    @InjectRepository(Department)
    private readonly departmentRepository: Repository<Department>
  ) {}

  // Create
  async createDepartment(data: DepartmentCreateInput) {
    console.log("DATA", data);
    const newDepartment = this.departmentRepository.create(data);
    console.log("NEW", newDepartment);
    return await this.departmentRepository.save(newDepartment);
  }

  // Read
  async department(id: number) {
    return await this.departmentRepository.findOne(id);
  }

  async departments() {
    return await this.departmentRepository.find();
  }
}

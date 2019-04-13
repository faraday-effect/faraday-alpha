import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Department } from "./department.entity";
import { Repository } from "typeorm";

@Injectable()
export class DepartmentService {
  constructor(
    @InjectRepository(Department)
    private readonly departmentRepository: Repository<Department>
  ) {}

  async findAll(): Promise<Department[]> {
    return await this.departmentRepository.find();
  }

  async addDepartment(name: string): Promise<Department> {
    const newDepartment = await this.departmentRepository.create({ name });
    return await this.departmentRepository.save(newDepartment);
  }
}

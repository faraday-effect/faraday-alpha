import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Department } from "./department.entity";
import { Repository } from "typeorm";

@Injectable()
export class DepartmentService {
  constructor(
    @InjectRepository(Department)
    private readonly repo: Repository<Department>
  ) {}

  async findAll(): Promise<Department[]> {
    return await this.repo.find();
  }

  async addDepartment(name: string): Promise<Department> {
    const newDepartment = this.repo.create({ name });
    return await this.repo.save(newDepartment);
  }
}

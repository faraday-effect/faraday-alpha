// ----- DEPARTMENT SERVICE -----

import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import {
  Department,
  DepartmentCreateInput,
  DepartmentWhereUniqueInput,
  DepartmentWhereInput,
  DepartmentOrderByInput,
  DepartmentUpdateInput
} from "./department.entity";

@Injectable()
export class DepartmentService {
  constructor(
    @InjectRepository(Department)
    private readonly departmentRepository: Repository<Department>
  ) {}

  // Create
  async createDepartment(data: DepartmentCreateInput) {
    const newDepartment = this.departmentRepository.create(data);
    return await this.departmentRepository.save(newDepartment);
  }

  async upsertDepartment(args: {
    where: DepartmentWhereUniqueInput;
    create: DepartmentCreateInput;
    update: DepartmentUpdateInput;
  }) {}

  // Read
  async department(where: DepartmentWhereUniqueInput) {
    return await this.departmentRepository.findOne(where);
  }

  async departments(args?: {
    where?: DepartmentWhereInput;
    orderBy?: DepartmentOrderByInput;
    skip?: number;
    take?: number;
  }) {
    if (args) {
      return await this.departmentRepository.find(args.where);
    } else {
      return await this.departmentRepository.find();
    }
  }

  // Update
  async updateDepartment(args: {
    data: DepartmentUpdateInput;
    where: DepartmentWhereUniqueInput;
  }) {}

  async updateManyDepartments(args: {
    data: DepartmentUpdateInput;
    where?: DepartmentWhereInput;
  }) {}

  // Delete
  async deleteDepartment(where: DepartmentWhereUniqueInput) {}

  async deleteManyDepartments(where?: DepartmentWhereInput) {}
}

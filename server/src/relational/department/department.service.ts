import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DepartmentEntity } from "./department.entity";
import { Repository } from "typeorm";

@Injectable()
export class DepartmentService {
  constructor(
    @InjectRepository(DepartmentEntity) private readonly repo: Repository<DepartmentEntity>
  ) {}

  async findAll(): Promise<DepartmentEntity[]> {
    return await this.repo.find();
  }

  async addDepartment(name: string): Promise<DepartmentEntity> {
    const newDepartment = this.repo.create({ name });
    return await this.repo.save(newDepartment);
  }
}

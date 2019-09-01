import { Injectable } from "@nestjs/common";
import { EntityManager, Repository } from "typeorm";
import { BaseService } from "../shared/base.service";
import {
  PrefixCreateInput,
  Prefix,
  DepartmentCreateInput,
  Department
} from "./entities";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class OrgService extends BaseService {
  constructor(
    protected readonly entityManager: EntityManager,
    @InjectRepository(Prefix) private readonly prefixRepo: Repository<Prefix>,
    @InjectRepository(Department)
    private readonly deptRepo: Repository<Department>
  ) {
    super(entityManager);
  }

  createPrefix(createInput: PrefixCreateInput) {
    return this.prefixRepo.save(this.prefixRepo.create(createInput));
  }

  createDepartment(createInput: DepartmentCreateInput) {
    return this.deptRepo.save(this.deptRepo.create(createInput));
  }
}

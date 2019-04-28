// ----- ROLE SERVICE -----

import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import {
  Role,
  RoleCreateInput,
  RoleWhereUniqueInput,
  RoleWhereInput,
  RoleOrderByInput,
  RoleUpdateInput
} from "./role.entity";

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>
  ) {}

  // Create
  async createRole(data: RoleCreateInput) {
    const newRole = this.roleRepository.create(data);
    return await this.roleRepository.save(newRole);
  }

  async upsertRole(args: {
    where: RoleWhereUniqueInput;
    create: RoleCreateInput;
    update: RoleUpdateInput;
  }) {}

  // Read
  async role(where: RoleWhereUniqueInput) {
    return await this.roleRepository.findOne(where);
  }

  async roles(args?: {
    where?: RoleWhereInput;
    orderBy?: RoleOrderByInput;
    skip?: number;
    take?: number;
  }) {
    return await this.roleRepository.find(args.where);
  }

  // Update
  async updateRole(args: {
    data: RoleUpdateInput;
    where: RoleWhereUniqueInput;
  }) {}

  async updateManyRoles(args: {
    data: RoleUpdateInput;
    where?: RoleWhereInput;
  }) {}

  // Delete
  async deleteRole(where: RoleWhereUniqueInput) {}

  async deleteManyRoles(where?: RoleWhereInput) {}
}

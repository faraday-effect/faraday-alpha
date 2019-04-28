// ----- USER SERVICE -----

import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import {
  User,
  UserCreateInput,
  UserWhereUniqueInput,
  UserWhereInput,
  UserOrderByInput,
  UserUpdateInput
} from "./user.entity";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}

  // Create
  async createUser(data: UserCreateInput) {
    const newUser = this.userRepository.create(data);
    return await this.userRepository.save(newUser);
  }

  async upsertUser(args: {
    where: UserWhereUniqueInput;
    create: UserCreateInput;
    update: UserUpdateInput;
  }) {}

  // Read
  async user(where: UserWhereUniqueInput) {
    return await this.userRepository.findOne(where);
  }

  async users(args?: {
    where?: UserWhereInput;
    orderBy?: UserOrderByInput;
    skip?: number;
    take?: number;
  }) {
    return await this.userRepository.find(args.where);
  }

  // Update
  async updateUser(args: {
    data: UserUpdateInput;
    where: UserWhereUniqueInput;
  }) {}

  async updateManyUsers(args: {
    data: UserUpdateInput;
    where?: UserWhereInput;
  }) {}

  // Delete
  async deleteUser(where: UserWhereUniqueInput) {}

  async deleteManyUsers(where?: UserWhereInput) {}
}

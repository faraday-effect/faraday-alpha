// ----- PREFIX SERVICE -----
// Generated 2019-04-27 19:12:17

import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import {
  Prefix,
  PrefixCreateInput,
  PrefixWhereUniqueInput,
  PrefixWhereInput,
  PrefixOrderByInput,
  PrefixUpdateInput
} from "./prefix.entity";

@Injectable()
export class PrefixService {
  constructor(
    @InjectRepository(Prefix)
    private readonly prefixRepository: Repository<Prefix>
  ) {}

  // Create
  async createPrefix(data: PrefixCreateInput) {
    const newPrefix = this.prefixRepository.create(data);
    return await this.prefixRepository.save(newPrefix);
  }

  async upsertPrefix(args: {
    where: PrefixWhereUniqueInput;
    create: PrefixCreateInput;
    update: PrefixUpdateInput;
  }) {}

  // Read
  async prefix(where: PrefixWhereUniqueInput) {
    return await this.prefixRepository.findOne(where);
  }

  async prefixes(args?: {
    where?: PrefixWhereInput;
    orderBy?: PrefixOrderByInput;
    skip?: number;
    take?: number;
  }) {
    return await this.prefixRepository.find(args.where);
  }

  // Update
  async updatePrefix(args: {
    data: PrefixUpdateInput;
    where: PrefixWhereUniqueInput;
  }) {}

  async updateManyPrefixes(args: {
    data: PrefixUpdateInput;
    where?: PrefixWhereInput;
  }) {}

  // Delete
  async deletePrefix(where: PrefixWhereUniqueInput) {}

  async deleteManyPrefixes(where?: PrefixWhereInput) {}
}

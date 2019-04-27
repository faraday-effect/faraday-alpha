// ----- TERM SERVICE -----
// Generated 2019-04-27 19:12:17

import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import {
  Term,
  TermCreateInput,
  TermWhereUniqueInput,
  TermWhereInput,
  TermOrderByInput,
  TermUpdateInput
} from "./term.entity";

@Injectable()
export class TermService {
  constructor(
    @InjectRepository(Term)
    private readonly termRepository: Repository<Term>
  ) {}

  // Create
  async createTerm(data: TermCreateInput) {
    const newTerm = this.termRepository.create(data);
    return await this.termRepository.save(newTerm);
  }

  async upsertTerm(args: {
    where: TermWhereUniqueInput;
    create: TermCreateInput;
    update: TermUpdateInput;
  }) {}

  // Read
  async term(where: TermWhereUniqueInput) {
    return await this.termRepository.findOne(where);
  }

  async terms(args?: {
    where?: TermWhereInput;
    orderBy?: TermOrderByInput;
    skip?: number;
    take?: number;
  }) {
    return await this.termRepository.find(args.where);
  }

  // Update
  async updateTerm(args: {
    data: TermUpdateInput;
    where: TermWhereUniqueInput;
  }) {}

  async updateManyTerms(args: {
    data: TermUpdateInput;
    where?: TermWhereInput;
  }) {}

  // Delete
  async deleteTerm(where: TermWhereUniqueInput) {}

  async deleteManyTerms(where?: TermWhereInput) {}
}

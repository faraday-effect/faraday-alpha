import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Term, TermCreateInput } from "./term.entity";

@Injectable()
export class TermService {
  public constructor(
    @InjectRepository(Term)
    private readonly termRepository: Repository<Term>
  ) {}

  // Create
  public async createTerm(data: TermCreateInput) {
    const newTerm = this.termRepository.create(data);
    return await this.termRepository.save(newTerm);
  }

  // Read
  public async term(id: number) {
    return await this.termRepository.findOne(id);
  }

  public async terms() {
    return await this.termRepository.find();
  }
}

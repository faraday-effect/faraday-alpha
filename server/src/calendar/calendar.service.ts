import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { EntityManager, Repository } from "typeorm";
import {
  DateRange,
  DateRangeCreateInput,
  Term,
  TermCreateInput
} from "./entities";
import { BaseService } from "../shared/base.service";

@Injectable()
export class CalendarService extends BaseService {
  constructor(
    protected readonly entityManager: EntityManager,
    @InjectRepository(Term)
    private readonly termRepo: Repository<Term>,
    @InjectRepository(DateRange)
    private readonly dateRangeRepo: Repository<DateRange>
  ) {
    super(entityManager);
  }

  createTerm(createInput: TermCreateInput) {
    return this.entityManager.transaction(async manager => {
      const termRepo = manager.getRepository(Term);
      const dateRangeRepo = manager.getRepository(DateRange);

      const newTerm = await termRepo.save(termRepo.create(createInput));

      for (const dateRange of createInput.dateRanges) {
        await dateRangeRepo.save(
          dateRangeRepo.create({
            ...dateRange,
            term: newTerm
          })
        );
      }

      return newTerm;
    });
  }

  createDateRange(dateRange: DateRangeCreateInput) {
    return this.dateRangeRepo.save(this.dateRangeRepo.create(dateRange));
  }
}

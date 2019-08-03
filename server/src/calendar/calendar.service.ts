import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Calendar, CalendarUpdateInput } from "./entities/calendar";
import { Repository } from "typeorm";
import { Term, TermCreateInput } from "./entities/Term";
import {
  DateRange,
  DateRangeCreateInput,
  DateRangeCreateInstance
} from "./entities/DateRange";

@Injectable()
export class CalendarService {
  constructor(
    @InjectRepository(Calendar)
    private readonly calendarRepository: Repository<Calendar>,
    @InjectRepository(Term)
    private readonly termRepository: Repository<Term>,
    @InjectRepository(DateRange)
    private readonly dateRangeRepository: Repository<DateRange>
  ) {}

  // Term
  createTerm(term: TermCreateInput) {
    const newTerm = this.termRepository.create({ ...term });
    return this.termRepository.save(newTerm);
  }

  term(id: number) {
    return this.termRepository.findOne(id);
  }

  terms() {
    return this.termRepository.find({ relations: ["dateRanges"] });
  }

  // DateRange
  async createDateRange(dateRange: DateRangeCreateInstance) {
    const newDateRange = this.dateRangeRepository.create(dateRange);
    return this.dateRangeRepository.save(newDateRange);
  }

  // Calendar
  createCalendar(name: string) {
    const newCalendar = this.calendarRepository.create({ name });
    return this.calendarRepository.save(newCalendar);
  }

  calendar(id: number) {
    return this.calendarRepository.findOne(id);
  }

  calendars() {
    return this.calendarRepository.find();
  }

  async updateCalendar(calendarData: CalendarUpdateInput) {
    const calendar = await this.calendarRepository.findOne(calendarData.id);
    if (calendarData.isFrozen !== undefined) {
      calendar.isFrozen = calendarData.isFrozen;
    }
    if (calendarData.name !== undefined) {
      calendar.name = calendarData.name;
    }
    return this.calendarRepository.save(calendar);
  }

  deleteCalendar(id: number) {
    return this.calendarRepository.delete(id);
  }
}

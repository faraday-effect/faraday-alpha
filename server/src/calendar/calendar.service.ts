import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Calendar, CalendarUpdateInput } from "./entities/calendar";
import { Repository } from "typeorm";
import { Term, TermCreateInput } from "./entities/Term";

@Injectable()
export class CalendarService {
  constructor(
    @InjectRepository(Calendar)
    private readonly calendarRepository: Repository<Calendar>,
    @InjectRepository(Term)
    private readonly termRepository: Repository<Term>
  ) {}

  // Term
  createTerm(term: TermCreateInput) {
    const newTerm = this.termRepository.create({ ...term });
    return this.termRepository.save(newTerm);
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

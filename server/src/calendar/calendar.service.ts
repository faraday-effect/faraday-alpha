import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Calendar, CalendarUpdateInput } from "./calendar.entities";
import { Repository } from "typeorm";

@Injectable()
export class CalendarService {
  constructor(
    @InjectRepository(Calendar)
    private readonly calendarRepository: Repository<Calendar>
  ) {}

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

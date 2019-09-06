import { DateTime } from "luxon";
import { VCalendarEvent } from "@/types/vuetify.types";
import { Transform, Type } from "class-transformer";

export class DateRange {
  title: string = "";

  @Transform(value => DateTime.fromISO(value))
  startDate: DateTime = {} as DateTime;

  // If no end date, make it the same as the start date.
  @Transform((value, obj) =>
    value ? DateTime.fromISO(value) : DateTime.fromISO(obj.startDate)
  )
  endDate: DateTime = {} as DateTime;

  contains(dt: DateTime) {
    return dt >= this.startDate && dt <= this.endDate;
  }

  asVCalendarEvent(): VCalendarEvent {
    return {
      name: this.title,
      start: this.startDate.toISODate(),
      end: this.endDate.toISODate()
    };
  }
}

export class Term {
  id = NaN;
  name = "";

  @Transform(value => DateTime.fromISO(value))
  startDate: DateTime = {} as DateTime;

  @Transform(value => DateTime.fromISO(value))
  endDate: DateTime = {} as DateTime;

  @Type(() => DateRange)
  dateRanges: DateRange[] = [];

  inAnyDateRange(dt: DateTime) {
    return this.dateRanges.find(range => range.contains(dt)) || null;
  }
}

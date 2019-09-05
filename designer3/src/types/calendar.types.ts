import { DateTime } from "luxon";
import { VCalendarEvent } from "@/types/vuetify.types";
import { Transform, Type } from "class-transformer";

export class DateRange {
  title: string = "";

  @Transform(value => DateTime.fromISO(value))
  startDate: DateTime = {} as DateTime;

  @Transform(value => DateTime.fromISO(value))
  endDate?: DateTime = {} as DateTime;

  asVCalendarEvent(): VCalendarEvent {
    return {
      name: this.title,
      start: this.startDate,
      end: this.endDate || this.startDate
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
}

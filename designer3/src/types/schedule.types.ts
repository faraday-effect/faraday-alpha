import { DateTime } from "luxon";
import { Offering, Section } from ".";

export class ClassDay {
  topics: string[] = [];

  constructor(
    readonly dateTime: DateTime,
    readonly week: number,
    readonly nthClassDay: number,
    readonly inDateRange: boolean,
    readonly nearestToToday: boolean,
    readonly firstDayOfWeek: boolean
  ) {}

  fullDate() {
    return this.dateTime.toFormat("ccc/dd-LLL-yyyy");
  }

  shortDate() {
    return this.dateTime.toFormat("ccccc/dd-LLL");
  }

  isAvailable() {
    return !this.inDateRange;
  }

  addTopic(topic: string) {
    this.topics.push(topic);
  }
}

export class ClassSchedule {
  readonly classDays: ClassDay[] = [];

  constructor(readonly offering: Offering, readonly section: Section) {
    const startDate = offering.term.startDate;
    const endDate = offering.term.endDate;

    const startWeekNumber = startDate.weekNumber;
    const firstDayOfWeek = section.firstDayOfWeek();

    let nthClassDay = 0;

    for (let dt = startDate; dt <= endDate; dt = dt.plus({ days: 1 })) {
      if (section.isClassDay(dt)) {
        const dateRange = offering.term.inAnyDateRange(dt);
        if (!dateRange) {
          nthClassDay += 1;
        }

        const newClassDay = new ClassDay(
          dt,
          dt.weekNumber - startWeekNumber + 1,
          nthClassDay,
          dateRange !== null,
          false,
          dt.weekday === firstDayOfWeek
        );

        if (dateRange) {
          newClassDay.addTopic(dateRange.title);
        }
        this.classDays.push(newClassDay);
      }
    }
  }

  *availableClassDays() {
    const classDays = this.classDays.filter(classDay => classDay.isAvailable());
    for (const classDay of classDays) {
      yield classDay;
    }
  }

  scheduleOffering(offering: Offering) {
    const classDays = this.availableClassDays();

    for (let unit of offering.units) {
      for (let topic of unit.topics) {
        const classDay = classDays.next().value;
        if (classDay) {
          classDay.addTopic(topic.title);
          topic.setClassDay(classDay);
        } else {
          throw new Error("Not enough days; TODO: fix this");
        }
      }
    }
  }
}

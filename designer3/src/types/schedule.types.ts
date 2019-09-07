import { DateTime } from "luxon";
import { Section } from ".";

export class ClassDay {
  topics: string[] = [];

  constructor(
    readonly dateTime: DateTime,
    readonly week: number,
    readonly nthCourseDay: number,
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

  constructor(readonly section: Section) {
    const startDate = section.offering.term.startDate;
    const endDate = section.offering.term.endDate;

    const startWeekNumber = startDate.weekNumber;
    const firstDayOfWeek = section.firstDayOfWeek();

    let nthCourseDay = 0;
    let nthClassDay = 0;

    for (let dt = startDate; dt <= endDate; dt = dt.plus({ days: 1 })) {
      if (section.isClassDay(dt)) {
        nthCourseDay += 1;

        const dateRange = section.offering.term.inAnyDateRange(dt);
        if (!dateRange) {
          nthClassDay += 1;
        }

        const newClassDay = new ClassDay(
          dt,
          dt.weekNumber - startWeekNumber + 1,
          nthCourseDay,
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

  availableClassDays() {
    return this.classDays.filter(classDay => classDay.isAvailable());
  }

  scheduleTopics() {
    const available = this.availableClassDays();
    // FIXME: Hard-wired unit.
    const topics = this.section.offering.units[0].topics;
    for (let idx = 0; idx < topics.length; idx++) {
      available[idx].addTopic(topics[idx].title);
      topics[idx].setClassDay(available[idx]);
    }
  }
}

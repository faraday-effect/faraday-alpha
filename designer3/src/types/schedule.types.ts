import { DateTime } from "luxon";
import { Section } from ".";

export class ClassDay {
  date = "";
  topics: string[] = [];

  constructor(
    private readonly dateTime: DateTime,
    readonly week: number,
    readonly nthCourseDay: number,
    readonly nthClassDay: number,
    readonly inDateRange: boolean,
    readonly nearestToToday: boolean,
    readonly firstDayOfWeek: boolean
  ) {
    this.date = dateTime.toFormat("ccc/dd-LLL-yyyy");
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
          false
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

  scheduleClasses() {
    const available = this.availableClassDays();
    const topics = this.section.offering.units[0].topics;
    for (let idx = 0; idx < topics.length; idx++) {
      available[idx].addTopic(topics[idx].title);
    }
  }
}

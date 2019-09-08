import { Term } from "./calendar.types";
import { Transform, Type } from "class-transformer";
import { Topic, Unit } from "@/types/syllabus.types";
import { DateTime } from "luxon";

const dayToLuxonWeekday = new Map<string, number>([
  ["S", 7],
  ["M", 1],
  ["T", 2],
  ["W", 3],
  ["R", 4],
  ["F", 5],
  ["A", 6]
]);

export class Section {
  id = NaN;
  title = "";
  regNumber = "";

  startTime = "";
  stopTime = "";

  @Transform(value => Section.convertDaysOfWeek(value))
  daysOfWeek: number[] = [];

  @Type(() => Offering)
  offering: Offering = {} as Offering;

  static convertDaysOfWeek = (dow: string) =>
    dow.split("").map(char => {
      const weekDay = dayToLuxonWeekday.get(char);
      if (!weekDay) {
        throw new Error(`No day of week called '${char}'`);
      }
      return weekDay;
    });

  isClassDay(dt: DateTime) {
    return this.daysOfWeek.includes(dt.weekday);
  }

  firstDayOfWeek() {
    return Math.min(...this.daysOfWeek);
  }

  addTopic(topic: Topic) {
    this.offering.units[0].topics.push(topic);
  }

  updateTopic(updatedTopic: Topic) {
    const targetTopic = this.offering.units[0].topics.find(
      topic => topic.id === updatedTopic.id
    );
    if (targetTopic) {
      targetTopic.title = updatedTopic.title;
      targetTopic.description = updatedTopic.description;
    } else {
      throw new Error(`Can't find topic matching ${updatedTopic}`);
    }
  }

  deleteTopic(topicId: number) {
    const unit = this.offering.units[0];
    unit.topics = unit.topics.filter(topic => topic.id !== topicId);
  }
}

export class Offering {
  id = NaN;
  title = "";
  creditHours = NaN;

  @Type(() => Term)
  term: Term = {} as Term;

  @Type(() => Section)
  sections: Section[] = [];

  @Type(() => Unit)
  units: Unit[] = [];
}

export class Course {
  id = NaN;
  number = "";
  title = "";

  @Type(() => Offering)
  offerings: Offering[] = [];
}

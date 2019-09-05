/*
import { DateTime } from "luxon";

class DateRange {
  readonly startDate: DateTime;
  readonly endDate: DateTime;

  constructor(readonly title: string, startDate: string, endDate: string) {
    this.startDate = DateTime.fromISO(startDate);
    this.endDate = DateTime.fromISO(endDate);
    // this.isClassDay = isClassDay;
  }

  includes(dt: DateTime) {
    return dt >= this.startDate && dt <= this.endDate;
  }
}

class Term {
  readonly startDate: DateTime;
  readonly endDate: DateTime;
  readonly dateRanges: DateRange[];

  constructor(
    readonly name: string,
    startDate: string,
    endDate: string,
    termDateRanges: { title: string; startDate: string; endDate: string }[]
  ) {
    this.startDate = DateTime.fromISO(startDate);
    this.endDate = DateTime.fromISO(endDate);
    this.dateRanges = termDateRanges.map(
      termDateRange =>
        new DateRange(
          termDateRange.title,
          termDateRange.startDate,
          termDateRange.endDate
        )
    );
  }
}

// This numbering reflects the convention of Luxon, our date-time package.
enum DayOfWeek {
  Monday = 1,
  Tuesday,
  Wednesday,
  Thursday,
  Friday,
  Saturday,
  Sunday
}

const dayMap = new Map<string, DayOfWeek>([
  ["S", DayOfWeek.Sunday],
  ["M", DayOfWeek.Monday],
  ["T", DayOfWeek.Tuesday],
  ["W", DayOfWeek.Wednesday],
  ["R", DayOfWeek.Thursday],
  ["F", DayOfWeek.Friday],
  ["A", DayOfWeek.Saturday]
]);

function dayToDayOfWeek(dayChar: string) {
  if (dayMap.has(dayChar)) {
    return dayMap.get(dayChar);
  } else {
    throw new Error(`Bogus dayChar '${dayChar}'`);
  }
}

class Section {
  readonly startTime: DateTime;
  readonly stopTime: DateTime;
  readonly daysOfWeek: DayOfWeek[] = [];

  constructor(
    readonly title: string,
    readonly term: Term,
    startTime: string,
    stopTime: string,
    daysOfWeek: string
  ) {
    this.startTime = DateTime.fromISO(startTime);
    this.stopTime = DateTime.fromISO(stopTime);

    for (let dayChar of daysOfWeek) {
      this.daysOfWeek.push(<DayOfWeek>dayToDayOfWeek(dayChar));
    }
  }

  isClassDay(dt: DateTime) {
    return this.daysOfWeek.includes(<DayOfWeek>dt.day);
  }

  isFixedDate(dt: DateTime) {
    for (let fixedDate of this.term.dateRanges) {
      if (fixedDate.includes(dt)) {
        return fixedDate;
      }
    }
    return null;
  }
}

// class Course {
//   constructor(
//     readonly title: string,
//     readonly prefix: string,
//     readonly number: string,
//     readonly sections: Section[]
//   ) {}
// }

// class OutlineNode {
//   static nextId = 0;
//
//   constructor(type, props, children) {
//     this.id = OutlineNode.nextId++;
//     this.type = type;
//     this.props = {};
//     this.children = children;
//
//     if (type === "org-data") {
//       this.props.title = "TOP LEVEL";
//       this.props.tags = [];
//       this.props.level = -1;
//     } else if (type === "headline") {
//       let m = props.title.match(/\[\[(.*?)]\[(.*?)]]/);
//       this.props.title = m ? m[2] : props.title;
//       this.props.tags = props.tags;
//       this.props.level = props.level;
//     } else {
//       throw new Error(`Unhandled type ${type}`);
//     }
//   }
//
//   hasTag(tag) {
//     return this.props.tags && this.props.tags.includes(tag);
//   }
// }
//
// class Outline {
//   constructor(orgOutline) {
//     this.root = Outline.convertOrgOutline(orgOutline);
//   }
//
//   static convertOrgOutline(orgOutline) {
//     let [type, props, ...children] = orgOutline;
//     return new OutlineNode(
//       type,
//       props,
//       children.map(child => Outline.convertOrgOutline(child))
//     );
//   }
//
//   deepestLevel() {
//     let max = -1;
//     for (let node of this.nodes()) {
//       max = Math.max(max, node.props.level);
//     }
//     return max;
//   }
//
//   *nodes(node = this.root) {
//     yield node;
//     for (let child of node.children) {
//       yield* this.nodes(child);
//     }
//   }
// }

class CalendarDay {
  constructor(details) {
    this.date = details.date;
    this.week = details.week; // Week within the term
    this.nthCourseDay = details.nthCourseDay; // Index of all course days
    this.nthClassDay = details.nthClassDay; // Index of only class days
    this.isClassDay = details.isClassDay; // Is this a class day (vs. a fixed ate)?
    this.nearestToToday = false; // Is this day closest today?
    this.firstDayOfWeek = false; // Is this the first day of a week?
    this.topics = [];
    this.assignments = [];
    this.todos = [];
  }

  addTopic(topic) {
    this.topics.push(topic);
  }

  addAssignment(assignment) {
    this.assignments.push(assignment);
  }

  addTodo(todo) {
    this.todos.push(todo);
  }
}

class Calendar {
  constructor(course) {
    this.days = [];
    this.nextCourseDay = 1;
    this.nextClassDay = 1;

    let term = course.term;
    let instruction_start = term.start;
    let instruction_end = term.end;

    let date = instruction_start.clone();
    while (date.isSameOrBefore(instruction_end)) {
      if (course.isClassDay(date)) {
        // Initialize generic calendar day attributes.
        let calDay = null;
        let calDayData = {
          date: date.clone(),
          week: this.weekOf(date),
          nthCourseDay: this.nextCourseDay++
        };

        let maybeFixedDate = course.isFixedDate(date);
        if (maybeFixedDate) {
          if (maybeFixedDate.isClassDay) {
            // Fixed date, but still a class day
            calDay = new CalendarDay({
              ...calDayData,
              isClassDay: true,
              nthClassDay: this.nextClassDay++
            });
          } else {
            // Fixed date that's not a class day.
            calDay = new CalendarDay({
              ...calDayData,
              isClassDay: false,
              nthClassDay: this.nextClassDay
            });
          }
          calDay.addTopic(maybeFixedDate.name);
        } else {
          // Ordinary class day.
          calDay = new CalendarDay({
            ...calDayData,
            isClassDay: true,
            nthClassDay: this.nextClassDay++
          });
        }
        this.days.push(calDay);
      }
      date.add(1, "d");
    }

    this.setNearestToToday();
    this.setFirstDayOfWeek();
  }

  weekOf(date) {
    if (this.days.length === 0) {
      return 1;
    }
    return date.week() - this.days[0].date.week() + 1;
  }

  totalClassDays() {
    return this.nextClassDay - 1;
  }

  totalCourseDays() {
    return this.nextCourseDay - 1;
  }

  setFirstDayOfWeek() {
    let currentWeek = -1;
    for (let day of this.days) {
      if (day.week !== currentWeek) {
        currentWeek = day.week;
        day.firstDayOfWeek = true;
      }
    }
  }

  setNearestToToday() {
    let nearestDay = this.days[0];
    let smallestDelta = Number.MAX_SAFE_INTEGER;

    const now = moment();
    for (let day of this.days) {
      let diff = Math.abs(now.diff(day.date, "hours"));
      if (diff < smallestDelta) {
        smallestDelta = diff;
        nearestDay = day;
      }
    }

    nearestDay.nearestToToday = true;
  }
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(value, max));
}

class ClassDayCursor {
  constructor(calendar) {
    this.classDays = calendar.days.filter(day => day.isClassDay);
    this.cursor = 0;
    this.pristine = true;
    this.lastIdx = this.classDays.length - 1;
  }

  current() {
    return this.classDays[this.cursor];
  }

  markDirty() {
    this.pristine = false;
  }

  advance() {
    this.markDirty();
    this.cursor = clamp(this.cursor + 1, 0, this.lastIdx);
  }

  advanceUnlessPristine() {
    if (!this.pristine) {
      this.advance();
    }
  }

  offset(n) {
    const idx = clamp(this.cursor + n, 0, this.lastIdx);
    return this.classDays[idx];
  }
}

class Schedule {
  constructor(course, orgOutline) {
    this.course = course;
    this.outline = new Outline(orgOutline);
    this.calendar = new Calendar(course);

    const cursor = new ClassDayCursor(this.calendar);
    for (let node of this.outline.nodes()) {
      switch (node.type) {
        case "org-data":
          break;
        case "headline":
          if (node.hasTag("topic")) {
            cursor.advanceUnlessPristine();
            let classDay = cursor.current();
            classDay.addTopic(node.props.title);
            node.calendarDay = classDay;
            cursor.markDirty();
          } else if (node.hasTag("hw")) {
            if (node.hasTag("before")) {
              let dueDay = cursor.current();
              node.calendarDay = dueDay;
              dueDay.addAssignment(node.props.title);

              cursor.offset(-2).addTodo(`Prep ${node.props.title}`);
              cursor.offset(-1).addTodo(`Assign ${node.props.title}`);
              cursor.offset(1).addTodo(`Grade ${node.props.title}`);
            } else if (node.hasTag("after")) {
              let dueDay = cursor.offset(1);
              node.calendarDay = dueDay;
              dueDay.addAssignment(node.props.title);

              cursor.offset(-1).addTodo(`Prep ${node.props.title}`);
              cursor.offset(0).addTodo(`Assign ${node.props.title}`);
              cursor.offset(2).addTodo(`Grade ${node.props.title}`);
            }
          }
          break;
        default:
          throw new Error(`Unknown node type ${node.type}`);
      }
    }
  }
}
*/

import { DateTime } from "luxon";
import pick from "lodash/pick";
import omit from "lodash/omit";
import { VCalendarEvent } from "@/components/vuetify.types";

export class DateRange {
  public title: string = "";
  public startDate: string = "";
  public endDate?: string = "";

  constructor(argObj: Partial<DateRange>) {
    Object.assign(this, argObj);
  }

  asVCalendarEvent(): VCalendarEvent {
    return {
      name: this.title,
      start: this.startDate,
      end: this.endDate || this.startDate
    };
  }
}

export class Term {
  public id: number = -1;
  public name: string = "";
  public startDate: string = "";
  public endDate: string = "";
  public dateRanges: DateRange[] = [];

  constructor(argObj: Partial<Term>) {
    Object.assign(this, omit(argObj, ["dateRanges"]));
    if (argObj.dateRanges) {
      this.dateRanges = argObj.dateRanges.map(range => new DateRange(range));
    }
  }

  get startDateTime() {
    return DateTime.fromISO(this.startDate);
  }

  get endDateTime() {
    return DateTime.fromISO(this.endDate);
  }
}

/*
function foo() {
  const o1 = {
    id: 42,
    name: "Foo",
    startDate: "2020",
    endDate: "2021",
    dateRanges: [
      {
        title: "Labor Day",
        startDate: "2020-02-02"
      },
      {
        title: "Thanksgiving",
        startDate: "2020-11-11",
        endDate: "2020-11-15"
      }
    ],
    startDateTime: DateTime.local(),
    endDateTime: DateTime.local()
  };

  const t2 = new Term(o1);

  console.log("T2", t2);
}

foo();
*/

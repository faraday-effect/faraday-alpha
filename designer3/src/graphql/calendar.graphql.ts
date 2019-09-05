import gql from "graphql-tag";
import { DateTime } from "luxon";
import omit from "lodash/omit";
import { VCalendarEvent } from "@/plugins/vuetify.types";

export const ALL_TERMS_QUERY = gql`
  query AllTerms {
    terms {
      id
      name
      startDate
      endDate
      dateRanges {
        title
        startDate
        endDate
      }
    }
  }
`;

export const ONE_TERM_QUERY = gql`
  query oneTerm($termId: Int!) {
    term(id: $termId) {
      name
      startDate
      endDate
      dateRanges {
        startDate
        endDate
        title
      }
    }
  }
`;

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
  id = 0;
  name = "";
  startDate = "";
  endDate = "";
  dateRanges: DateRange[] = [];

  // constructor(argObj: Partial<Term>) {
  //   Object.assign(this, omit(argObj, ["dateRanges"]));
  //   if (argObj.dateRanges) {
  //     this.dateRanges = argObj.dateRanges.map(range => new DateRange(range));
  //   }
  // }

  // TODO: Cache these Luxon calculations.

  get startDateTime() {
    return DateTime.fromISO(this.startDate);
  }

  get endDateTime() {
    return DateTime.fromISO(this.endDate);
  }
}

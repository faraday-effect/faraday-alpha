import gql from "graphql-tag";
import { DateTime } from "luxon";
import { VCalendarEvent } from "@/plugins/vuetify.types";
import { Type } from "class-transformer";

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
  title: string = "";
  startDate: string = "";
  endDate?: string = "";

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
  startDate = "";
  endDate = "";

  @Type(() => DateRange)
  dateRanges: DateRange[] = [];

  // TODO: Cache these Luxon calculations.

  get startDateTime() {
    return DateTime.fromISO(this.startDate);
  }

  get endDateTime() {
    return DateTime.fromISO(this.endDate);
  }
}

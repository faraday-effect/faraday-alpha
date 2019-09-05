import gql from "graphql-tag";
import { Term } from "./calendar.graphql";
import { Unit } from "@/graphql/syllabus.graphql";
import { Type } from "class-transformer";

export const ONE_COURSE_QUERY = gql`
  query OneCourse($courseId: Int!) {
    course(id: $courseId) {
      id
      number
      title
      offerings {
        id
        title
        sections {
          id
          startTime
          stopTime
        }
        term {
          id
          startDate
          endDate
          dateRanges {
            title
            startDate
            endDate
          }
        }
        units {
          id
          description
          topics {
            id
            title
            description
          }
        }
      }
    }
  }
`;

export const ONE_OFFERING_QUERY = gql`
  query OneOffering($offeringId: Int!) {
    offering(id: $offeringId) {
      id
      title
      sections {
        id
        startTime
        stopTime
      }
      term {
        id
        startDate
        endDate
        dateRanges {
          title
          startDate
          endDate
        }
      }
      units {
        id
        description
        topics {
          id
          title
          description
        }
      }
    }
  }
`;

export class Section {
  id = NaN;
  title = "";
  regNumber = "";
  daysOfWeek = "";
  startTime = "";
  stopTime = "";
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

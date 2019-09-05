import gql from "graphql-tag";

export const ONE_OFFERING_QUERY = gql`
  query OneOffering($offeringId: Int!) {
    offering(id: $offeringId) {
      id
      title
      course {
        prefix {
          name
        }
        number
        title
      }
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

export class Course {
  public id = -Infinity;
  public number = "";
  public title = "";

  constructor(argObj: Course) {
    Object.assign(this, argObj);
  }
}

export class Section {
  public id = -Infinity;
  public title = "";
  public regNumber = "";
  public daysOfWeek = "";
  public startTime = "00:00:00";
  public stopTime = "00:00:00";

  constructor(argObj: Offering) {
    Object.assign(this, argObj);
  }
}

export class Offering {
  public id = -Infinity;
  public title = "";
  public creditHours = -Infinity;
  public course: Course | undefined;
  public sections: Section[] = [];

  constructor(argObj: Offering) {
    Object.assign(this, argObj);
  }
}

import gql from "graphql-tag";

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
      creditHours
      sections {
        id
        startTime
        stopTime
        daysOfWeek
        regNumber
        title
      }
      term {
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
      units {
        id
        title
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

export const ONE_SECTION_QUERY = gql`
  query OneSection($sectionId: Int!) {
    section(id: $sectionId) {
      title
      regNumber
      startTime
      stopTime
      daysOfWeek
      offering {
        course {
          prefix {
            name
          }
          number
          title
        }
        title
        creditHours
        term {
          name
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
          title
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

export const ALL_OFFERINGS_QUERY = gql`
  query {
    offerings {
      id
      creditHours
      title
      course {
        prefix {
          name
        }
        number
        title
      }
      term {
        id
        name
        startDate
        endDate
        dateRanges {
          id
          title
          startDate
          endDate
        }
      }
      units {
        id
        title
        description
        topics {
          id
          title
          description
        }
      }
      sections {
        id
        title
        regNumber
        daysOfWeek
        startTime
        stopTime
      }
    }
  }
`;
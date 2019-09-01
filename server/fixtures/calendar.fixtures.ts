import { gql } from "apollo-boost";
import { Fixture } from "./fixture.types";

const CREATE_TERM = gql`
  mutation CreateTerm($data: TermCreateInput!) {
    createTerm(createInput: $data) {
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
  }
`;

const terms = [
  {
    name: "Fall 2019",
    startDate: "2019-08-26",
    endDate: "2019-12-11",
    dateRanges: [
      {
        title: "Labor Day",
        startDate: "2019-09-02"
      },
      {
        title: "Fall Break",
        startDate: "2019-10-11",
        endDate: "2019-10-14"
      },
      {
        title: "Thanksgiving",
        startDate: "2019-11-27",
        endDate: "2019-12-01"
      }
    ]
  }
];

const fixtures: Fixture[] = [
  {
    uniqueName: "terms",
    description: "terms with various date ranges",
    graphQlMutation: CREATE_TERM,
    graphQlData: terms,
    idPath: "name",
    tablesToTruncate: ["term", "date_range"]
  }
];

export default fixtures;

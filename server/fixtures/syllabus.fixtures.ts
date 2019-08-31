import { gql } from "apollo-boost";
import { Fixture } from "./fixture.types";

const CREATE_UNIT = gql`
  mutation CreateUnit($data: UnitCreateInput!) {
    createUnit(createInput: $data) {
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
`;

const units = [
  {
    title: "Asynchronous JavaScript",
    description: "Fun with Asynchronicity",
    topics: [
      {
        title: "Callbacks",
        description: "The worst way to do it"
      },
      {
        title: "Promises",
        description: "Somewhat better"
      },
      {
        title: "Async/Await",
        description: "Almost like synchronous code"
      }
    ]
  }
];

const details: Fixture = {
  uniqueName: "units",
  description: "units with topics",
  graphQlMutation: CREATE_UNIT,
  graphQlData: units,
  idPath: "title",
  tablesToTruncate: ["unit"]
};

export default details;

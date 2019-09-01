import { gql } from "apollo-boost";
import { Fixture } from "./fixture.types";

const CREATE_PREFIX = gql`
  mutation CreatePrefix($data: PrefixCreateInput!) {
    createPrefix(createInput: $data) {
      id
      name
      description
    }
  }
`;

const CREATE_DEPARTMENT = gql`
  mutation CreateDepartment($data: DepartmentCreateInput!) {
    createDepartment(createInput: $data) {
      id
      name
    }
  }
`;

const prefixes = [
  {
    name: "COS",
    description: "Computer Science"
  },
  {
    name: "PHY",
    description: "Physics"
  }
];

const departments = [
  { name: "Computer Science & Engineering" },
  { name: "Physics & Engineering" }
];

const fixtures: Fixture[] = [
  {
    uniqueName: "prefixes",
    description: "prefixes",
    graphQlMutation: CREATE_PREFIX,
    graphQlData: prefixes,
    idPath: "name",
    tablesToTruncate: ["prefix"]
  },
  {
    uniqueName: "departments",
    description: "academic departments",
    graphQlMutation: CREATE_DEPARTMENT,
    graphQlData: departments,
    idPath: "name",
    tablesToTruncate: ["department"]
  }
];

export default fixtures;

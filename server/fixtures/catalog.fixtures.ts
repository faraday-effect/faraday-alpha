import { gql } from "apollo-boost";
import { Fixture } from "./fixture.types";
import { Department, Prefix } from "../src/org/entities";
import { foreignInstanceId } from "./db-helpers";

const CREATE_COURSE = gql`
  mutation CreateCourse($data: CourseCreateInput!) {
    createCourse(createInput: $data) {
      id
      number
      title
    }
  }
`;

function courses() {
  return [
    {
      number: "243",
      title: "Multi-tier Web Application Development",
      prefixId: foreignInstanceId(Prefix, { name: "PHY" }),
      departmentId: foreignInstanceId(Department, {
        name: "Physics & Engineering"
      })
    }
  ];
}

const fixtures: Fixture[] = [
  {
    uniqueName: "courses",
    description: "catalog courses",
    graphQlMutation: CREATE_COURSE,
    graphQlData: courses(),
    idPath: "title",
    tablesToTruncate: ["course"]
  }
];

export default fixtures;

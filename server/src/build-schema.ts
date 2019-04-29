import { buildSchema } from "type-graphql";
import { DepartmentResolver } from "./relational/department/department.resolver";
import { TermResolver } from "./relational/term/term.resolver";
import { CourseResolver } from "./relational/course/course.resolver";

const schema = buildSchema({
  resolvers: [DepartmentResolver, TermResolver, CourseResolver]
});

console.log("SCHEMA", schema);

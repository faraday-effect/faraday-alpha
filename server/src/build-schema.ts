import { printSchema } from "graphql";
import { buildSchema } from "type-graphql";
import { CourseResolver } from "./relational/course/course.resolver";
import { DepartmentResolver } from "./relational/department/department.resolver";
import { TermResolver } from "./relational/term/term.resolver";

function createSchema() {
  return buildSchema({
    resolvers: [DepartmentResolver, TermResolver, CourseResolver]
  });
}

(async () => {
  const schema = await createSchema();
  const sdl = printSchema(schema);
  console.log(sdl);
})();

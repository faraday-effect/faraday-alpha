/**
 * Helpful little utility that generates GraphQL schemata
 * from code-first `type-graphql` classes.
 */

import { printSchema } from "graphql";
import { buildSchema, buildTypeDefsAndResolvers } from "type-graphql";
import { DepartmentResolver } from "../relational/department/department.resolver";
import { TermResolver } from "../relational/term/term.resolver";
import { CourseResolver } from "../relational/course/course.resolver";

const resolvers = [DepartmentResolver, TermResolver, CourseResolver];

function createSchema() {
  return buildSchema({
    resolvers
  });
}

function createTypedefsAndResolvers() {
  return buildTypeDefsAndResolvers({
    resolvers
  });
}

(async () => {
  const schema = await createSchema();
  const sdl = printSchema(schema);
  console.log(sdl);

  const { typeDefs, resolvers } = await createTypedefsAndResolvers();
  console.log("TYPEDEFS", typeDefs);
  console.log("RESOLVERS", resolvers);
})();

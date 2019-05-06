import { GraphQLSchema, graphql, printSchema } from "graphql";
import { Maybe, buildSchema } from "type-graphql";
import { CourseResolver } from "../relational/course/course.resolver";
import { DepartmentResolver } from "../relational/department/department.resolver";
import { PrefixResolver } from "../relational/prefix/prefix.resolver";
import { TermResolver } from "../relational/term/term.resolver";

function createSchema() {
  return buildSchema({
    resolvers: [
      CourseResolver,
      DepartmentResolver,
      PrefixResolver,
      TermResolver
    ]
  });
}

interface GqlCallOptions {
  source: string;
  variableValues?: Maybe<{
    [key: string]: any;
  }>;
}

// Schema cache.
let schema: GraphQLSchema;

export async function gqlCall({ source, variableValues }: GqlCallOptions) {
  if (!schema) {
    schema = await createSchema();
    console.log("SCHEMA", printSchema(schema));
  }
  console.log(`SOURCE: ${source}, VALS: ${variableValues}`);

  return graphql({
    schema,
    source,
    variableValues
  });
}

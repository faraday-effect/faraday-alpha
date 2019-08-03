/**
 * Helpful little utility that generates GraphQL schemata
 * from code-first `type-graphql` classes.
 */

import { printSchema } from "graphql";
import { buildSchema, buildTypeDefsAndResolvers } from "type-graphql";
import { CalendarResolver } from "../calendar/calendar.resolvers";

const resolvers = [CalendarResolver];

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

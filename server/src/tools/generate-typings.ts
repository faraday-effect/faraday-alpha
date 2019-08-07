import { GraphQLDefinitionsFactory } from "@nestjs/graphql";
import { join } from "path";

const definitionsFactory = new GraphQLDefinitionsFactory();
definitionsFactory.generate({
  typePaths: ["./src/tools/**/*.graphql"],
  path: join(process.cwd(), "src/tools/calendar.graphql.ts"),
  outputAs: "class"
});

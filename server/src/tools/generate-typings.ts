import { GraphQLDefinitionsFactory } from "@nestjs/graphql";
import { join } from "path";

const definitionsFactory = new GraphQLDefinitionsFactory();
definitionsFactory.generate({
  typePaths: ["./src/tools/**/*.graphql"],
  path: join(process.cwd(), "src/tools/graphql.ts"),
  outputAs: "class"
});

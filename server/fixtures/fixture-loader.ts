import ApolloClient from "apollo-boost";
import fetch from "node-fetch";
import { FixtureMutation } from "./fixture.types";
import termDetails from "./term.fixture";
import get from "lodash/get";

const client = new ApolloClient({
  uri: "http://localhost:3000/graphql",
  fetch: fetch
});

async function mutate(mutations: FixtureMutation[]) {
  for (const mutation of mutations) {
    console.log(`Loading ${mutation.description}`);
    for (const datum of mutation.data) {
      console.log("  ", get(datum, mutation.idPath));
      try {
        const result = await client.mutate({
          mutation: mutation.graphQL,
          variables: {
            [mutation.paramName]: datum
          }
        });
      } catch (err) {
        console.log("ERROR", err);
        throw err;
      }
    }
  }
}

const allMutations: FixtureMutation[] = [termDetails];
mutate(allMutations);

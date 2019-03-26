const { GraphQLClient } = require("graphql-request");
const { knex, resetDatabase } = require("../../datasources/faraday/manage-db");

const endpoint = "http://localhost:4000/graphql";
const client = new GraphQLClient(endpoint);

describe("Users", () => {
  beforeEach(() => {
    return resetDatabase();
  });

  test("create a user", async () => {
    const data = await client.request(`mutation {
      signUp(email: "fred@ziffle.com", password: "password") {
        token
      }
    }`);
    expect(data.signUp.token).toMatch(/^[^.]+\.[^.]+\.[^.]+$/);

    return knex("users").then(users => {
      expect(users).toHaveLength(1);
      expect(users[0].email).toEqual("fred@ziffle.com");
    });
  });
});

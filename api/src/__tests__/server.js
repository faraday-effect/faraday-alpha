const { GraphQLClient } = require("graphql-request");

const ENDPOINT = "http://localhost:4000/graphql";
const client = new GraphQLClient(ENDPOINT);

describe("Basics", () => {
  test("sanity check", () => {
    expect(true).toBe(true);
  });

  test("ping pong", async () => {
    const data = await client.request(`{
      ping { 
        arch cpus platform release hostname 
      }        
    }`);
    expect(data).toHaveProperty("ping.arch");
    expect(data).toHaveProperty("ping.release");
  });
});

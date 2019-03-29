describe("Basics", () => {
  const client = require("../helpers/graphql-client");

  test("sanity check", () => {
    expect(true).toBe(true);
  });

  test("ping pong", async () => {
    // language=GraphQL
    const data = await client.request(`{
      ping { 
        arch cpus platform release hostname 
      }        
    }`);
    for (let prop of ["arch", "cpus", "platform", "release", "hostname"]) {
      expect(data).toHaveProperty(`ping.${prop}`);
    }
  });
});

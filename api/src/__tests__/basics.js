const gql = require("graphql-tag");

describe("Basics", () => {
  const client = require("../helpers/test-client");

  test("sanity check", () => {
    expect(true).toBe(true);
  });

  test("ping pong", async () => {
    return client
      .query({
        query: gql`
          query pp {
            ping {
              arch
              cpus
              platform
              release
              hostname
            }
          }
        `
      })
      .then(data => {
        for (let prop of ["arch", "cpus", "platform", "release", "hostname"]) {
          expect(data).toHaveProperty(`data.ping.${prop}`);
        }
      });
  });
});

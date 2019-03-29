const { knex, resetDatabase } = require("../datasources/faraday/manage-db");
const casual = require("casual");

async function signUpHelper(client, email, password) {
  // language=GraphQL
  const query = `
    mutation createUser($email: String!, $password: String!) {
      signUp(email: $email, password: $password) {
        token
      }
    }
  `;

  const data = await client.request(query, {
    email: email,
    password: password
  });
  return data;
}

describe("Users", () => {
  const client = require("../helpers/graphql-client");
  const jwtPattern = /^[^.]+\.[^.]+\.[^.]+$/;

  // language=GraphQL
  const SIGN_IN_MUTATION = `
      mutation ($email: String!, $password: String! ){ 
            signIn(email: $email, password: $password) {
            token
        }
      }
  `;

  beforeEach(() => {
    return resetDatabase();
  });

  test("can sign up", async () => {
    const email = "fred@ziffle.com";
    const data = await signUpHelper(client, email, "password");
    expect(data.signUp.token).toMatch(jwtPattern);

    return knex("users").then(users => {
      expect(users).toHaveLength(1);
      expect(users[0].email).toEqual(email);
    });
  });

  test("can sign in with valid credentials", async () => {
    const email = "zelda@ziffle.com";
    const password = casual.word;
    await signUpHelper(client, email, password);

    const data = await client.request(SIGN_IN_MUTATION, { email, password });
    expect(data.signIn.token).toMatch(jwtPattern);
  });

  test("can't sign in with bogus credentials", async () => {
    const email = "notValid@example.com";
    const password = casual.word;

    try {
      await client.request(SIGN_IN_MUTATION, { email, password });
    } catch (e) {
      console.log(JSON.stringify(e, null, 4));
    }
    // expect(data.signIn.token).toMatch(jwtPattern);
  });
});

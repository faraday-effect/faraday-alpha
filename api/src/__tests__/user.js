const gql = require("graphql-tag");
const { knex, resetDatabase } = require("../datasources/faraday/manage-db");
const casual = require("casual");

async function signUpHelper(client, email, password) {
  const result = await client.mutate({
    mutation: gql`
      mutation createUser($email: String!, $password: String!) {
        signUp(email: $email, password: $password) {
          token
        }
      }
    `,
    variables: {
      email: email,
      password: password
    }
  });

  return result.data;
}

describe("Users", () => {
  const client = require("../helpers/graphql-client");
  const jwtPattern = /^[^.]+\.[^.]+\.[^.]+$/;

  const SIGN_IN_MUTATION = gql`
    mutation($email: String!, $password: String!) {
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

  test.skip("can't sign up with existing email address", () => {});

  test("can sign in with valid credentials", async () => {
    const email = "zelda@ziffle.com";
    const password = casual.word;
    await signUpHelper(client, email, password);

    const result = await client.mutate({
      mutation: SIGN_IN_MUTATION,
      variables: { email, password }
    });
    expect(result.data.signIn.token).toMatch(jwtPattern);
  });

  test("can't sign in with bogus email", () => {
    const email = "notValid@example.com";
    const password = "password";

    return client
      .mutate({
        mutation: SIGN_IN_MUTATION,
        variables: { email, password }
      })
      .catch(error => {
        expect(error.message).toMatch(/Invalid credentials/);
      });
  });

  test.skip("can't sign in with invalid password", () => {});
});

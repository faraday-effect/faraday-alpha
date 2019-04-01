const gql = require("graphql-tag");
const { knex, resetDatabase } = require("../datasources/faraday/manage-db");
const casual = require("casual");

function signUpHelper(client, email, password) {
  return client.mutate({
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
}

describe("A user", () => {
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

  test("can sign up with valid credentials", async () => {
    const email = "fred@ziffle.com";
    const { data } = await signUpHelper(client, email, "password");

    expect(data.signUp.token).toMatch(jwtPattern);

    return knex("users").then(users => {
      expect(users).toHaveLength(1);
      expect(users[0].email).toEqual(email);
    });
  });

  test("can't sign up with empty email", async () => {
    expect.assertions(1);
    return signUpHelper(client, "", "non-empty password").catch(error =>
      expect(error.message).toMatch(/Email address can't be empty/)
    );
  });

  test("can't sign up with empty password", async () => {
    expect.assertions(1);
    return signUpHelper(client, "fred@example.com", "").catch(error =>
      expect(error.message).toMatch(/Password can't be empty/)
    );
  });

  test("can't sign up with bogus email", async () => {
    expect.assertions(1);
    return signUpHelper(client, "not.an.email.com", "password").catch(error =>
      expect(error.message).toMatch(/Email address is invalid/)
    );
  });

  test("can't sign up with existing email address", async () => {
    const email = "zelda@ziffle.com";
    const password = casual.word;
    expect.assertions(2);

    // Sign up.
    const { data } = await signUpHelper(client, email, password);
    expect(data.signUp.token).toMatch(jwtPattern);

    // Sign up again with the same email.
    return signUpHelper(client, email, password).catch(error => {
      expect(error.message).toMatch(/Email already in use/);
    });
  });

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

  test("can't sign in an unregistered email", () => {
    expect.assertions(1);
    const email = "unregistered@example.com";
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

  test("can't sign in with invalid password", async () => {
    expect.assertions(1);
    const email = "zelda@ziffle.com";
    const password = casual.word;
    await signUpHelper(client, email, password);

    return client
      .mutate({
        mutation: SIGN_IN_MUTATION,
        variables: {
          email,
          password: password
            .split("")
            .reverse()
            .join("")
        }
      })
      .then(val => console.debug("THEN", val))
      .catch(error => {
        expect(error.message).toMatch(/Invalid credentials/);
      });
  });
});

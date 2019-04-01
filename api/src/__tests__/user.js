const gql = require("graphql-tag");
const { knex, resetDatabase } = require("../datasources/faraday/manage-db");
const casual = require("casual");

function signUpHelper(client, input) {
  return client.mutate({
    mutation: gql`
      mutation createUser($input: UserInput!) {
        signUp(input: $input) {
          token
        }
      }
    `,
    variables: { input }
  });
}

function makeFakeUser() {
  return {
    email: casual.email,
    password: casual.password,
    firstName: casual.first_name,
    lastName: casual.last_name
  };
}

describe("A user", () => {
  const client = require("../helpers/graphql-client");
  const jwtPattern = /^[^.]+\.[^.]+\.[^.]+$/;

  const SIGN_IN_MUTATION = gql`
    mutation($email: String!, $password: String!) {
      signIn(email: $email, password: $password) {
        user {
          id
          email
          firstName
          lastName
        }
        token
      }
    }
  `;

  beforeEach(() => {
    return resetDatabase();
  });

  test("can sign up with valid credentials", async () => {
    const fakeUser = makeFakeUser();
    const { data } = await signUpHelper(client, fakeUser);
    expect(data.signUp.token).toMatch(jwtPattern);

    return knex("users").then(users => {
      expect(users).toHaveLength(1);
      expect(users[0].email).toEqual(fakeUser.email);
    });
  });

  test("can't sign up with empty email", async () => {
    expect.assertions(1);
    const fakeUser = makeFakeUser();
    fakeUser.email = "";

    return signUpHelper(client, fakeUser).catch(error =>
      expect(error.message).toMatch(/Email address can't be empty/)
    );
  });

  test("can't sign up with empty password", async () => {
    expect.assertions(1);
    const fakeUser = makeFakeUser();
    fakeUser.password = "";

    return signUpHelper(client, fakeUser).catch(error =>
      expect(error.message).toMatch(/Password can't be empty/)
    );
  });

  test("can't sign up with bogus email", async () => {
    expect.assertions(1);
    const fakeUser = makeFakeUser();
    fakeUser.email = "not.an.email.com";

    return signUpHelper(client, fakeUser).catch(error =>
      expect(error.message).toMatch(/Email address is invalid/)
    );
  });

  test("can't sign up with existing email address", async () => {
    expect.assertions(2);
    const fakeUser = makeFakeUser();

    // Sign up.
    const { data } = await signUpHelper(client, fakeUser);
    expect(data.signUp.token).toMatch(jwtPattern);

    // Sign up again with the same email.
    return signUpHelper(client, fakeUser).catch(error => {
      expect(error.message).toMatch(/Email already in use/);
    });
  });

  test("can sign in with valid credentials", async () => {
    const fakeUser = makeFakeUser();
    await signUpHelper(client, fakeUser);

    const result = await client.mutate({
      mutation: SIGN_IN_MUTATION,
      variables: { email: fakeUser.email, password: fakeUser.password }
    });
    expect(result.data.signIn.token).toMatch(jwtPattern);
  });

  test("can't sign in an unregistered email", () => {
    expect.assertions(1);
    const fakeUser = makeFakeUser();

    return client
      .mutate({
        mutation: SIGN_IN_MUTATION,
        variables: { email: fakeUser.email, password: fakeUser.password }
      })
      .catch(error => {
        expect(error.message).toMatch(/Invalid credentials/);
      });
  });

  test("can't sign in with invalid password", async () => {
    expect.assertions(1);
    const fakeUser = makeFakeUser();
    await signUpHelper(client, fakeUser);

    return client
      .mutate({
        mutation: SIGN_IN_MUTATION,
        variables: {
          email: fakeUser.email,
          password: fakeUser.password
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

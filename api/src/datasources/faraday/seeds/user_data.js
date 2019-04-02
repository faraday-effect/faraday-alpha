const casual = require("casual");
const _ = require("lodash");

const FAKE_USER_COUNT = 10;
const PHONE_FRACTION = 0.7;

const _randomPhone = () => casual.random < PHONE_FRACTION ? casual.phone : "";

exports.seed = async function(knex) {
  await knex("users").del();

  const fakeUsers = _.times(FAKE_USER_COUNT, () => ({
    email: casual.email,
    password: casual.password,
    firstName: casual.first_name,
    lastName: casual.last_name,
    officePhone: _randomPhone(),
    mobilePhone: _randomPhone()
  }));

  await knex("users").insert([
    {
      email: "admin@example.com",
      password: "password",
      firstName: "Super",
      lastName: "User",
      mobilePhone: "555-1212"
    },
    ...fakeUsers
  ]);
};

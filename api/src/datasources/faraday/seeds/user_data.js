exports.seed = async function(knex) {
  await knex("users").del();
  await knex("users").insert([
    { email: "fred@ziffle.com", password: "password" },
    { email: "zelda@ziffle.com", password: "password" }
  ]);
};

exports.seed = async function(knex) {
  await knex("courses").del();
  await knex("courses").insert([
    { number: "COS 243", title: "Multi-tier Web Application Development" },
    { number: "COS 343", title: "Advanced Database Concepts" }
  ]);
};

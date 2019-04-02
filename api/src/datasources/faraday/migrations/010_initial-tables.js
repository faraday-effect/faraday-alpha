exports.up = async function(knex) {
  await knex.schema.createTable("prefixes", table => {
    table.increments();
    table
      .string("name")
      .unique()
      .notNullable();
  });

  await knex.schema.createTable("departments", table => {
    table.increments();
    table
      .string("name")
      .unique()
      .notNullable();
  });

  await knex.schema.createTable("users", table => {
    table.increments();
    table.string("email").notNullable();
    table.string("password").notNullable();
    table.string("firstName").notNullable();
    table.string("lastName").notNullable();
    table.string("officePhone");
    table.string("mobilePhone");
  });

  await knex.schema.createTable("courses", table => {
    table.increments();
    table.string("number").notNullable();
    table.string("title").notNullable();
  });
};

exports.down = async function(knex) {
  for (let tableName of ["users", "courses", "prefixes", "departments"]) {
    await knex.schema.dropTable(tableName);
  }
};

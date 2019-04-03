exports.up = async function(knex) {
  await knex.schema.createTable("prefixes", table => {
    table.increments();
    table.string("value").notNullable();
  });
  await knex.schema.createTable("departments", table => {
    table.increments();
    table.string("name").notNullable();
  });
  await knex.schema.createTable("courses", table => {
    table.increments();
    table.string("number").notNullable();
    table.string("title").notNullable();
    table
      .integer("prefix_id")
      .notNullable()
      .references("prefixes.id");
    table
      .integer("department_id")
      .notNullable()
      .references("departments.id");
  });
  await knex.schema.createTable("users", table => {
    table.increments();
    table
      .string("email")
      .notNullable()
      .unique();
    table.string("password").notNullable();
    table.string("firstName").notNullable();
    table.string("lastName").notNullable();
    table.string("officePhone");
    table.string("mobilePhone");
  });
};

exports.down = async function(knex) {
  await knex.schema.dropTable("users");
  await knex.schema.dropTable("courses");
  await knex.schema.dropTable("departments");
  await knex.schema.dropTable("prefixes");
};


exports.up = async function(knex) {
  await knex.schema.createTable("users", table => {
    table.increments();
    table.string("email");
    table.string("password").notNullable();
    table.string("firstName");
    table.string("lastName");
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
  await knex.schema.dropTable("users");
  await knex.schema.dropTable("courses");
};

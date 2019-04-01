const path = require("path");

// Stay DRY: use the configuration from the knex file.
const knexDevConfig = require("./knexfile")["development"];
const Knex = require("knex");
const knex = Knex(knexDevConfig);

const config = {
  knex: knexDevConfig,
  dbManager: {
    superUser: "owner",
    superPassword: "password"
  }
};

const dbManager = require("knex-db-manager").databaseManagerFactory(config);

async function resetDatabase() {
  await dbManager.truncateDb();
}

async function seedDatabase() {
  await dbManager.populateDb(path.join(__dirname, "seeds", "*.js"));
}

module.exports = { knex, resetDatabase, seedDatabase };

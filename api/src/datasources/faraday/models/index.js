const Knex = require("knex");
const knexfile = require("../knexfile");
const knex = Knex(knexfile["development"]);

const { Model } = require("objection");
Model.knex(knex);

module.exports = {
  Course: require("./Course"),
  User: require("./User")
};

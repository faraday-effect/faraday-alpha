"use strict";
module.exports = (sequelize, DataTypes) => {
  const Course = sequelize.define(
    "Course",
    {
      number: DataTypes.STRING,
      title: DataTypes.STRING
    },
    {}
  );
  Course.associate = function(models) {
    // associations can be defined here
  };
  return Course;
};

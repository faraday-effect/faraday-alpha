import { config } from "dotenv";

import { ConnectionOptions } from "typeorm";

import { DateRange, Term } from "./calendar/entities";
import { Activity, Topic, Unit } from "./syllabus/entities";
import { Department, Prefix } from "./org/entities";
import { Course, Offering, Section } from "./catalog/entities";

config();

const options: ConnectionOptions = {
  type: "postgres",
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  username: process.env.PG_USERNAME,
  password: process.env.PG_PASSWORD,
  entities: [
    Term,
    DateRange,
    Activity,
    Topic,
    Unit,
    Department,
    Prefix,
    Course,
    Offering,
    Section
  ]
};

export default options;

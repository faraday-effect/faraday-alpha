import { config } from "dotenv";

import { DateRange, Term } from "./calendar/entities";
import { Topic, Unit } from "./syllabus/entities";
import { ConnectionOptions } from "typeorm";

config();

const options: ConnectionOptions = {
  type: "postgres",
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  username: process.env.PG_USERNAME,
  password: process.env.PG_PASSWORD,
  entities: [Term, DateRange, Topic, Unit]
};

export default options;

import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { Course } from "./src/relational/course/course.entity";
import { Department } from "./src/relational/department/department.entity";
import { Holiday } from "./src/relational/holiday/holiday.entity";
import { Prefix } from "./src/relational/prefix/prefix.entity";
import { Role } from "./src/relational/role/role.entity";
import { Section } from "./src/relational/section/section.entity";
import { Term } from "./src/relational/term/term.entity";
import { User } from "./src/relational/user/user.entity";

export const ormConfig: TypeOrmModuleOptions = {
  type: "postgres",
  host: "localhost",
  port: 5432,
  database: "faraday",
  username: "faraday",
  password: undefined,
  synchronize: true,
  entities: [Course, Department, Holiday, Prefix, Section, Term, Role, User]
};

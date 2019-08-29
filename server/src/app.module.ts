import { Module } from "@nestjs/common";
import { GraphQLModule } from "@nestjs/graphql";
import { TypeOrmModule } from "@nestjs/typeorm";

import { AppController } from "./app.controller";

import { TelemetryModule } from "./telemetry/telemetry.module";
import { CalendarModule } from "./calendar/calendar.module";
import { DateRange, Term } from "./calendar/entities";
import { Topic, Unit } from "./syllabus/entities";
import { SyllabusModule } from "./syllabus/syllabus.module";

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "postgres",
      host: process.env.PG_HOST,
      database: process.env.PG_DATABASE,
      username: process.env.PG_USERNAME,
      password: process.env.PG_PASSWORD,
      entities: [Term, DateRange, Topic, Unit],
      synchronize: true,
      logging: true
    }),
    GraphQLModule.forRoot({
      autoSchemaFile: "generated-schema.graphql"
    }),
    TelemetryModule,
    CalendarModule,
    SyllabusModule
  ],
  controllers: [AppController]
})
export class AppModule {}

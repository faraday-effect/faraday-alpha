import { Module } from "@nestjs/common";
import { GraphQLModule } from "@nestjs/graphql";
import { TypeOrmModule } from "@nestjs/typeorm";

import { AppController } from "./app.controller";

import { TelemetryModule } from "./telemetry/telemetry.module";
import { CalendarModule } from "./calendar/calendar.module";
import { Calendar } from "./calendar/calendar.entities";

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "postgres",
      host: process.env.PG_HOST,
      database: process.env.PG_DATABASE,
      username: process.env.PG_USERNAME,
      password: process.env.PG_PASSWORD,
      entities: [Calendar],
      synchronize: true
    }),
    GraphQLModule.forRoot({
      autoSchemaFile: "generated-schema.gql"
    }),
    TelemetryModule,
    CalendarModule
  ],
  controllers: [AppController]
})
export class AppModule {}

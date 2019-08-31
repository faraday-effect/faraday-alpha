import { Module } from "@nestjs/common";
import { GraphQLModule } from "@nestjs/graphql";
import { TypeOrmModule } from "@nestjs/typeorm";

import { AppController } from "./app.controller";

import { TelemetryModule } from "./telemetry/telemetry.module";
import { CalendarModule } from "./calendar/calendar.module";
import { SyllabusModule } from "./syllabus/syllabus.module";
import typeORMConfig from "./typeorm-config";

@Module({
  imports: [
    TypeOrmModule.forRoot({
      ...typeORMConfig,
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

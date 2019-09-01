import { Module } from "@nestjs/common";
import { GraphQLModule } from "@nestjs/graphql";
import { TypeOrmModule } from "@nestjs/typeorm";

import { AppController } from "./app.controller";
import typeORMConfig from "./typeorm-config";

import { TelemetryModule } from "./telemetry/telemetry.module";
import { CalendarModule } from "./calendar/calendar.module";
import { SyllabusModule } from "./syllabus/syllabus.module";
import { CatalogModule } from "./catalog/catalog.module";
import { OrgModule } from "./org/org.module";

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
    SyllabusModule,
    CatalogModule,
    OrgModule
  ],
  controllers: [AppController]
})
export class AppModule {}

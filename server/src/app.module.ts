import { Module } from "@nestjs/common";
import { GraphQLModule } from "@nestjs/graphql";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AppController } from "./app.controller";
import { RelationalModule } from "./relational/relational.module";
import { TelemetryModule } from "./telemetry/telemetry.module";
import { Department } from "./relational/department/department.entity";

@Module({
  imports: [
    TypeOrmModule.forRoot({
      entities: [Department]
    }),
    GraphQLModule.forRoot({
      autoSchemaFile: "schema.gql"
    }),
    TelemetryModule,
    RelationalModule
  ],
  controllers: [AppController]
})
export class AppModule {}

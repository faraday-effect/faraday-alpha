import { Module } from "@nestjs/common";
import { GraphQLModule } from "@nestjs/graphql";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AppController } from "./app.controller";
import { RelationalModule } from "./relational/relational.module";
import { TelemetryModule } from "./telemetry/telemetry.module";

@Module({
  imports: [
    TypeOrmModule.forRoot(),
    GraphQLModule.forRoot({
      autoSchemaFile: "schema.gql"
    }),
    TelemetryModule,
    RelationalModule
  ],
  controllers: [AppController]
})
export class AppModule {}

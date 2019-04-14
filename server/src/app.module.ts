import { Module } from "@nestjs/common";
import { GraphQLModule } from "@nestjs/graphql";
import { TypeOrmModule } from "@nestjs/typeorm";
import { RelationalModule } from "./relational/relational.module";
import { TelemetryModule } from "./telemetry/telemetry.module";
import { WeatherModule } from './weather/weather.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(),
    GraphQLModule.forRoot({
      autoSchemaFile: "schema.gql"
    }),
    TelemetryModule,
    RelationalModule,
    WeatherModule
  ]
})
export class AppModule {}

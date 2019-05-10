import { Module } from "@nestjs/common";
import { GraphQLModule } from "@nestjs/graphql";
import { AppController } from "./app.controller";
import { GraphQLConfigService } from "./prisma/graphql-config.service";
import { TelemetryModule } from "./telemetry/telemetry.module";

@Module({
  imports: [
    GraphQLModule.forRootAsync({
      useClass: GraphQLConfigService
    }),
    TelemetryModule
  ],
  controllers: [AppController]
})
export class AppModule {}

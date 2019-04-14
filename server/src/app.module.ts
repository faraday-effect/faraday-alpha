import { Module } from "@nestjs/common";
import { TelemetryModule } from "./telemetry/telemetry.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { RelationalModule } from "./relational/relational.module";

@Module({
  imports: [TypeOrmModule.forRoot(), TelemetryModule, RelationalModule]
})
export class AppModule {}

import { Module } from "@nestjs/common";
import { TelemetryController } from "./telemetry.controller";

@Module({
  controllers: [TelemetryController]
})
export class TelemetryModule {}

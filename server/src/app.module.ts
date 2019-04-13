import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { TelemetryModule } from "./telemetry/telemetry.module";
import { DepartmentModule } from "./department/department.module";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
  imports: [TypeOrmModule.forRoot(), TelemetryModule, DepartmentModule],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TelemetryModule } from './telemetry/telemetry.module';

@Module({
  imports: [TelemetryModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

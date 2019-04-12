import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TelemetryModule } from './telemetry/telemetry.module';
import { RelationalDataModule } from './relational-data/relational-data.module';

@Module({
  imports: [TelemetryModule, RelationalDataModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

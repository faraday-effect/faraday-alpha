import { Module } from '@nestjs/common';
import { WeatherResolver } from './weather.resolver';
import { WeatherService } from './weather.service';

@Module({
  providers: [WeatherResolver, WeatherService]
})
export class WeatherModule {}

import { Injectable } from "@nestjs/common";
import { Forecast } from "./forecast.schema";

@Injectable()
export class WeatherService {
  async getForecast(): Promise<Forecast> {
    return {
      highTemp: 72,
      lowTemp: 42
    };
  }
}

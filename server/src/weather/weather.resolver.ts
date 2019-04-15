import { Resolver, Query, Mutation, Args } from "@nestjs/graphql";
import { Forecast } from "./forecast.schema";
import { WeatherService } from "./weather.service";
import { NewForecastInput } from "./forecast-input.dto";

@Resolver("Forecast")
export class WeatherResolver {
  constructor(private readonly weatherService: WeatherService) {}

  @Query(returns => Forecast)
  async forecast() {
    return this.weatherService.getForecast();
  }

  @Mutation(returns => Forecast)
  async addForecast(
    @Args("newForecastData") newForecastData: NewForecastInput
  ): Promise<Forecast> {
    return {
      lowTemp: newForecastData.lowTemp - 1,
      highTemp: newForecastData.highTemp + 1
    };
  }
}

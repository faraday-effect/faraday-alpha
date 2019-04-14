import { InputType, Field } from "type-graphql";

@InputType()
export class NewForecastInput {
    @Field()
    lowTemp: number;

    @Field()
    highTemp: number;
}

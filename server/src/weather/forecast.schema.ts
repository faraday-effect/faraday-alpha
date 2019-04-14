import { Field, ObjectType } from "type-graphql";

@ObjectType()
export class Forecast {
  @Field()
  highTemp: number;

  @Field()
  lowTemp: number;
}

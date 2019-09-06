import { Type } from "class-transformer";

export class Topic {
  id = NaN;
  title = "";
  description = "";
}

export class Unit {
  id = NaN;
  title = "";
  description = "";

  @Type(() => Topic)
  topics: Topic[] = [];
}

import { Type } from "class-transformer";

export class Topic {
  id = NaN;
  title = "";
  description = "";

  constructor(id: number, title: string, description: string) {
    this.id = id;
    this.title = title;
    this.description = description;
  }
}

export class Unit {
  id = NaN;
  title = "";
  description = "";

  @Type(() => Topic)
  topics: Topic[] = [];

  addTopic(topic: Topic) {
    this.topics.push(topic);
  }
}

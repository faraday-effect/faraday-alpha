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

  addTopic(id: number, title: string, description: string) {
    this.topics.push(new Topic(id, title, description));
  }
}
